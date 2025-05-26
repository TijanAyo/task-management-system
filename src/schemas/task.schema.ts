import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
  }),
});
