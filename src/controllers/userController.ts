import { Context } from "koa";
import { UserRepository } from "../repository/userRepository";
import { UserBookService } from "../services/userBookService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/auth";
import z from "zod";

export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userBookService: UserBookService
  ) {}

  async getMyProfile(ctx: Context) {
    try {
      const userId = ctx.state.user.id;
      const user = await this.userRepository.findOnePublic(userId);

      if (!user) {
        return sendErrorResponse(ctx, 404, "User not found");
      }
      return sendSuccessResponse(ctx, 200, { user });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to get user profile");
    }
  }

  async getMyBooks(ctx: Context) {
    try {
      const userId = ctx.state.user.id;
      const result = await this.userBookService.getUserBooks(userId);

      if (!result.success) {
        return sendErrorResponse(ctx, 404, result.error!);
      }

      return sendSuccessResponse(ctx, 200, { books: result.books });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to get user books");
    }
  }

  async addBookToMe(ctx: Context) {
    try {
      const { bookId } = ctx.request.body;
      const userId = ctx.state.user.id;

      const result = await this.userBookService.addBookToUser(bookId, userId);

      if (!result.success) {
        const status =
          result.error === "User already owns this book" ? 409 : 404;
        return sendErrorResponse(ctx, status, result.error!);
      }

      return sendSuccessResponse(ctx, 201, {
        message: result.message,
        userBook: result.userBook,
      });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to add book to collection");
    }
  }

  async removeBookFromMe(ctx: Context) {
    try {
      const bookId = parseInt(ctx.params.bookId);
      const userId = ctx.state.user.id;

      if (isNaN(bookId)) {
        return sendErrorResponse(ctx, 400, "Invalid book ID");
      }

      const result = await this.userBookService.removeBookFromUser(
        bookId,
        userId
      );

      if (!result.success) {
        const status =
          result.error === "User does not own this book" ? 404 : 500;
        return sendErrorResponse(ctx, status, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        message: result.message,
      });
    } catch (error) {
      return sendErrorResponse(
        ctx,
        500,
        "Failed to remove book from collection"
      );
    }
  }

  async getAllUsers(ctx: Context) {
    try {
      const users = await this.userRepository.findAllPublic();

      // Password automatically excluded by repository
      return sendSuccessResponse(ctx, 200, {
        users,
        count: users.length,
      });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to get users");
    }
  }

  // GET /users/:id - Get single user profile
  async getUserProfile(ctx: Context) {
    try {
      const userId = parseInt(ctx.params.id);
      if (isNaN(userId)) {
        return sendErrorResponse(ctx, 400, "Invalid user ID");
      }

      const user = await this.userRepository.findOnePublic(userId);
      if (!user) {
        return sendErrorResponse(ctx, 404, "User not found");
      }

      return sendSuccessResponse(ctx, 200, { user });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to get user profile");
    }
  }

  async getUserBooks(ctx: Context) {
    try {
      const userId = parseInt(ctx.params.id);
      if (isNaN(userId)) {
        return sendErrorResponse(ctx, 400, "Invalid user ID");
      }

      // Check if user exists
      const user = await this.userRepository.findOnePublic(userId);
      if (!user) {
        return sendErrorResponse(ctx, 404, "User not found");
      }

      const result = await this.userBookService.getUserBooks(userId);
      if (!result.success) {
        return sendErrorResponse(ctx, 500, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        books: result.books || [],
        count: result.books?.length || 0,
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (error) {
      return sendErrorResponse(ctx, 500, "Failed to get user books");
    }
  }

  async searchUsers(ctx: Context) {
    try {
      const querySchema = z.object({
        authorName: z.string().optional(),
        bookTitle: z.string().optional()
      }).refine(
        (data) => data.authorName || data.bookTitle,
        { message: "At least one search parameter (authorName or bookTitle) is required" }
      );

      const searchParams = querySchema.parse(ctx.query);
      const result = await this.userBookService.searchUsers(searchParams);

      if (!result.success) {
        return sendErrorResponse(ctx, 400, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        users: result.users || [],
        count: result.users?.length || 0
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(ctx, 400, `Validation failed: ${error.message}`);
      }
      return sendErrorResponse(ctx, 500, "Failed to search users");
    }
  }
}
