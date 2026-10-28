import { z } from "zod";

// A schema describes and validates the shape and constraints of form data.
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
    lastName: z.string().trim().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Use only letters, numbers, and underscores"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  // refine adds a cross-field rule and assigns the error to the confirmation field.
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// z.infer derives the TypeScript type directly from its validation schema.
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
