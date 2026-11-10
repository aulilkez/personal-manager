import { asc, desc, eq, or, sql } from 'drizzle-orm';

import type { DatabaseClient } from '@/core/database/client';
import { tasks } from '@/core/database/schema';
import { taskInputSchema, taskSchema, type TaskInput, type TaskStatus } from '../domain/task';

export function createTasksRepository(database: DatabaseClient) {
  return {
    async list(search = '') {
      const normalizedSearch = search.trim();
      const query = database.select().from(tasks);
      const rows = normalizedSearch
        ? query
            .where(
              or(
                sql`instr(lower(${tasks.title}), lower(${normalizedSearch})) > 0`,
                sql`instr(lower(${tasks.description}), lower(${normalizedSearch})) > 0`,
              ),
            )
            .orderBy(asc(tasks.status), desc(tasks.updatedAt))
            .all()
        : query.orderBy(asc(tasks.status), desc(tasks.updatedAt)).all();

      return rows.map((row) => taskSchema.parse(row));
    },

    async create(input: TaskInput) {
      const values = taskInputSchema.parse(input);
      const now = Date.now();
      const result = database
        .insert(tasks)
        .values({ ...values, createdAt: now, updatedAt: now })
        .run();
      const [task] = database
        .select()
        .from(tasks)
        .where(eq(tasks.id, result.lastInsertRowId))
        .limit(1)
        .all();

      if (!task) {
        throw new Error('The task was saved but could not be loaded.');
      }

      return taskSchema.parse(task);
    },

    async update(id: number, input: TaskInput) {
      const values = taskInputSchema.parse(input);
      const result = database
        .update(tasks)
        .set({ ...values, updatedAt: Date.now() })
        .where(eq(tasks.id, id))
        .run();

      if (result.changes === 0) {
        throw new Error('The task no longer exists.');
      }

      const [task] = database.select().from(tasks).where(eq(tasks.id, id)).limit(1).all();
      if (!task) {
        throw new Error('The updated task could not be loaded.');
      }

      return taskSchema.parse(task);
    },

    async setStatus(id: number, status: TaskStatus) {
      const result = database
        .update(tasks)
        .set({ status, updatedAt: Date.now() })
        .where(eq(tasks.id, id))
        .run();

      if (result.changes === 0) {
        throw new Error('The task no longer exists.');
      }
    },

    async delete(id: number) {
      const result = database.delete(tasks).where(eq(tasks.id, id)).run();

      if (result.changes === 0) {
        throw new Error('The task no longer exists.');
      }
    },
  };
}
