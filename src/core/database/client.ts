import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

import * as schema from './schema';

export type DatabaseClient = ExpoSQLiteDatabase<typeof schema>;

export function createDatabaseClient(connection: SQLiteDatabase): DatabaseClient {
  return drizzle(connection, { schema });
}
