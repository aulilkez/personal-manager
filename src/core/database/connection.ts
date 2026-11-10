import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import type { SQLiteDatabase } from 'expo-sqlite';

import { createDatabaseClient } from './client';
import { migrations, migrationChecksums } from './migrations/migrations';
import { schemaMigrations } from './schema/migrations.schema';
import { createFeatureLogger, normalizeError } from '@/core/logging';

export const DATABASE_NAME = 'personal-manager.db';
const DATABASE_VERSION = migrations.journal.entries.length;
const log = createFeatureLogger('database');

interface StoredMigration {
  version: number;
  checksum: string;
}

async function tableExists(database: SQLiteDatabase, tableName: string): Promise<boolean> {
  const table = await database.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?;",
    tableName,
  );
  return table !== null;
}

async function readStoredMigrations(database: SQLiteDatabase): Promise<StoredMigration[]> {
  if (!(await tableExists(database, 'schema_migrations'))) {
    return [];
  }

  const rows = await database.getAllAsync<StoredMigration>(
    'SELECT version, checksum FROM schema_migrations ORDER BY version;',
  );

  for (const row of rows) {
    if (!Number.isInteger(row.version) || row.version < 1 || !/^[a-f0-9]{64}$/.test(row.checksum)) {
      throw new Error('The local database contains invalid migration history.');
    }

    if (row.version > DATABASE_VERSION) {
      throw new Error('The local database schema is newer than this app supports.');
    }

    if (migrationChecksums[row.version] !== row.checksum) {
      throw new Error('A previously applied database migration does not match this app.');
    }
  }

  return rows;
}

async function seedLegacyTasksMigration(
  database: SQLiteDatabase,
  currentVersion: number,
  storedMigrations: StoredMigration[],
): Promise<void> {
  if (
    currentVersion !== 1 ||
    storedMigrations.length > 0 ||
    !(await tableExists(database, 'tasks')) ||
    (await tableExists(database, '__drizzle_migrations'))
  ) {
    return;
  }

  const taskTable = await database.getFirstAsync<{ sql: string }>(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'tasks';",
  );
  const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(tasks);');
  const columnNames = new Set(columns.map((column) => column.name));
  const requiredColumns = ['id', 'title', 'description', 'status', 'created_at', 'updated_at'];
  const taskIndex = await database.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'tasks_status_updated_at_idx';",
  );
  if (
    !requiredColumns.every((column) => columnNames.has(column)) ||
    !taskTable?.sql.toLowerCase().includes('check') ||
    !taskIndex
  ) {
    throw new Error('The existing tasks table cannot be safely migrated.');
  }

  const legacyMigration = migrations.journal.entries[0];
  const legacyChecksum = migrationChecksums[1];
  if (!legacyMigration || !legacyChecksum) {
    throw new Error('The initial database migration is missing.');
  }

  await database.withTransactionAsync(async () => {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY NOT NULL,
        applied_at INTEGER NOT NULL,
        checksum TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL,
        created_at NUMERIC
      );
    `);
    await database.runAsync(
      'INSERT INTO schema_migrations (version, applied_at, checksum) VALUES (?, ?, ?);',
      1,
      Date.now(),
      legacyChecksum,
    );
    await database.runAsync(
      'INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?);',
      '',
      legacyMigration.when,
    );
  });
}

async function initializeDatabaseSchema(connection: SQLiteDatabase): Promise<void> {
  await connection.execAsync('PRAGMA journal_mode = WAL;');
  await connection.execAsync('PRAGMA foreign_keys = ON;');

  const foreignKeys = await connection.getFirstAsync<{ foreign_keys: number }>(
    'PRAGMA foreign_keys;',
  );
  if (foreignKeys?.foreign_keys !== 1) {
    throw new Error('SQLite foreign key enforcement is unavailable.');
  }

  const versionResult = await connection.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version;',
  );
  const currentVersion = versionResult?.user_version ?? 0;
  if (currentVersion > DATABASE_VERSION) {
    throw new Error('The local database schema is newer than this app supports.');
  }

  const storedMigrations = await readStoredMigrations(connection);
  await seedLegacyTasksMigration(connection, currentVersion, storedMigrations);

  const client = createDatabaseClient(connection);
  await migrate(client, migrations);

  await client.transaction((transaction) => {
    for (const entry of migrations.journal.entries) {
      const version = entry.idx + 1;
      const checksum = migrationChecksums[version];
      if (!checksum) {
        throw new Error(`The checksum for database migration ${version} is missing.`);
      }

      const [existing] = transaction
        .select({ version: schemaMigrations.version })
        .from(schemaMigrations)
        .where(eq(schemaMigrations.version, version))
        .limit(1)
        .all();

      if (!existing) {
        transaction
          .insert(schemaMigrations)
          .values({ version, appliedAt: Date.now(), checksum })
          .run();
      }
    }
  });

  const appliedMigrations = await readStoredMigrations(connection);
  if (appliedMigrations.length !== DATABASE_VERSION) {
    throw new Error('The local database migration history is incomplete.');
  }

  await connection.withTransactionAsync(async () => {
    await connection.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
  });
}

export async function initializeDatabase(connection: SQLiteDatabase): Promise<void> {
  try {
    await initializeDatabaseSchema(connection);
  } catch (error) {
    log.error('Database initialization or migration failed.');
    throw normalizeError(error);
  }
}
