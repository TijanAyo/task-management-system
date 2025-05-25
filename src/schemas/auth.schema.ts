import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(1, "Password is required").trim(),
  }),
});
