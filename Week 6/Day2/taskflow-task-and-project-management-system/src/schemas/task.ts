import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').default(''),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().min(1, 'Due date is required'),
  projectId: z.string().min(1, 'Please select a project'),
  tags: z.array(z.string()).default([]),
});

export type TaskFormData = z.infer<typeof taskSchema>;
