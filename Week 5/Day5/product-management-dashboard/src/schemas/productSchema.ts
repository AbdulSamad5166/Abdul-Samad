import { z } from 'zod';

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters'),
  price: z
    .number()
    .positive('Price must be greater than 0'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative'),
  category: z
    .string()
    .trim()
    .min(1, 'Category is required'),
  brand: z
    .string()
    .trim()
    .min(1, 'Brand is required'),
  thumbnail: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
