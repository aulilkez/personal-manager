import { sql } from 'drizzle-orm';
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { TaskStatus } from '@/modules/tasks/domain/task';

export const tasks = sqliteTable(
  'tasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: text('status').$type<TaskStatus>().notNull().default('todo'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('tasks_status_updated_at_idx').on(table.status, table.updatedAt),
    check('tasks_status_check', sql`${table.status} IN ('todo', 'in_progress', 'completed')`),
  ],
);
