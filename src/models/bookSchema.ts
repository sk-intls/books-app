import { z } from "zod";

export const bookSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  author_id: z.number().int().positive("Author is required"),
});

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  author_id: z.number().int().positive("Author is required"),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long").optional(),
  author_id: z.number().int().positive("Author is required").optional(),
});

export const findByAuthorSchema = z.object({
  author_id: z.number().int().positive("Author ID is required"),
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

export interface BookWithAuthor extends Book {
  author?: {
    id: number;
    name: string;
    birth_year?: number;
    death_year?: number;
  };
}

export interface BookWithDetails extends Book {
  author?: {
    id: number;
    name: string;
    birth_year?: number;
    death_year?: number;
  };
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}
