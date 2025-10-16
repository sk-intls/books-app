import { z } from "zod";

export const userSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  username: z.string().min(2),
  password: z.string().min(8),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string().min(10),
});

export const loginSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(8),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
