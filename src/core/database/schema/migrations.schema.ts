import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const schemaMigrations = sqliteTable('schema_migrations', {
  version: integer('version').primaryKey(),
  appliedAt: integer('applied_at').notNull(),
  checksum: text('checksum').notNull(),
});
