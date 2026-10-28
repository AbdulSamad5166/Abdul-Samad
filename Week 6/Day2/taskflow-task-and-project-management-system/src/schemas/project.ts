import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().trim().min(2, 'Project name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  description: z.string().trim().max(300, 'Description cannot exceed 300 characters').default(''),
  color: z.string().min(1, 'Please select a color badge').default('#0d9488'),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
