import { z } from "zod";

export const userBookSchema = z.object({
  id: z.number().int().positive().optional(),
  user_id: z.number().int().positive("User ID is required"),
  book_id: z.number().int().positive("Book ID is required"),
});


export const createUserBookSchema = z.object({
  user_id: z.number().int().positive("User ID is required"),
  book_id: z.number().int().positive("Book ID is required"),
});


export type UserBook = z.infer<typeof userBookSchema> & {
  created_at?: Date;
  updated_at?: Date;
};

export type CreateUserBookData = z.infer<typeof createUserBookSchema>;


export interface UserBookWithDetails extends UserBook {
  book?: {
    id: number;
    title: string;
    author_id: number;
  };
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
}