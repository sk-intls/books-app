import { z } from "zod";

export const bookSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  author: z.string().min(1, "Author is required").max(255, "Author name too long"),
  user_id: z.number().int().positive().optional(),
});

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  author: z.string().min(1, "Author is required").max(255, "Author name too long"),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long").optional(),
  author: z.string().min(1, "Author is required").max(255, "Author name too long").optional(),
});

export const findByAuthorSchema = z.object({
  author: z.string().min(1, "Author name is required"),
});

export const findByTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type Book = z.infer<typeof bookSchema> & {
  created_at?: Date;
  updated_at?: Date;
};

export type CreateBookData = z.infer<typeof createBookSchema>;
export type UpdateBookData = z.infer<typeof updateBookSchema>;
export type FindByAuthorData = z.infer<typeof findByAuthorSchema>;
export type FindByTitleData = z.infer<typeof findByTitleSchema>;

export interface BookWithUser extends Book {
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}