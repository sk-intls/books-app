import { z } from "zod";

export const authorSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Author name is required").max(255, "Author name too long"),
  birth_year: z.number().int().min(1).max(new Date().getFullYear()).nullable().optional(),
  death_year: z.number().int().min(1).max(new Date().getFullYear()).nullable().optional(),
});

export const createAuthorSchema = z.object({
  name: z.string().min(1, "Author name is required").max(255, "Author name too long"),
  birth_year: z.number().int().min(1).max(new Date().getFullYear()).optional(),
  death_year: z.number().int().min(1).max(new Date().getFullYear()).optional(),
});

export const updateAuthorSchema = z.object({
  name: z.string().min(1, "Author name is required").max(255, "Author name too long").optional(),
  birth_year: z.number().int().min(1).max(new Date().getFullYear()).nullable().optional(),
  death_year: z.number().int().min(1).max(new Date().getFullYear()).nullable().optional(),
});

export type Author = z.infer<typeof authorSchema> & {
  created_at?: Date;
  updated_at?: Date;
};

export type CreateAuthorData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorData = z.infer<typeof updateAuthorSchema>;