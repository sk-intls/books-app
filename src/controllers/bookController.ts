import { Context } from "koa";
import { z } from "zod";
import { BookService } from "../services/bookService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/auth";

export class BookController {
  constructor(private bookService: BookService) {}

  async searchBooks(ctx: Context) {
    try {
      const querySchema = z
        .object({
          title: z.string().optional(),
          authorName: z.string().optional(),
        })
        .refine((data) => data.title || data.authorName, {
          message:
            "At least one search parameter (title or authorName) is required",
        });

      const searchParams = querySchema.parse(ctx.query);
      const result = await this.bookService.searchBooks(searchParams);

      if (!result.success) {
        return sendErrorResponse(ctx, 500, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        books: result.books || [],
        count: result.books?.length || 0,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(
          ctx,
          400,
          `Validation failed: ${error.message}`
        );
      }
      return sendErrorResponse(ctx, 500, "Failed to search books");
    }
  }

  async updateBook(ctx: Context) {
    try {
      const bookId = parseInt(ctx.params.id);
      if (isNaN(bookId)) {
        return sendErrorResponse(ctx, 400, "Invalid book ID");
      }

      const updateSchema = z
        .object({
          title: z.string().min(1).optional(),
          authorName: z.string().min(1).optional(),
        })
        .refine((data) => data.title || data.authorName, {
          message: "At least one field (title or authorName) is required",
        });

      const updateData = updateSchema.parse(ctx.request.body);
      const result = await this.bookService.updateBook(bookId, updateData);

      if (!result.success) {
        const status = result.error === "Book not found" ? 404 : 500;
        return sendErrorResponse(ctx, status, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        message: result.message,
        book: result.book,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(
          ctx,
          400,
          `Validation failed: ${error.message}`
        );
      }
      return sendErrorResponse(ctx, 500, "Failed to update book");
    }
  }
}
