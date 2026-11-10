import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'completed']);

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'Enter a task title.').max(120, 'Use 120 characters or fewer.'),
  description: z.string().trim().max(500, 'Use 500 characters or fewer.').default(''),
  status: taskStatusSchema.default('todo'),
});

export const taskSchema = taskInputSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskInput = z.input<typeof taskInputSchema>;
export type Task = z.infer<typeof taskSchema>;
