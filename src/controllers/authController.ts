import { Context } from "koa";
import { z } from "zod";
import {
  userSchema,
  loginSchema,
  changePasswordSchema,
} from "../models/userSchema";
import { AuthService } from "../services/authService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/auth";

export class AuthController {
  constructor(private authService: AuthService) {}

  async signUp(ctx: Context) {
    try {
      const userData = ctx.request.body;
      const validatedData = userSchema.parse(userData);

      const result = await this.authService.signUp(validatedData);

      if (!result.success) {
        const status = result.error === "Username is taken" ? 409 : 500;
        return sendErrorResponse(ctx, status, result.error!);
      }

      return sendSuccessResponse(ctx, 201, {
        message: "User created successfully",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(ctx, 400, "Validation failed");
      }
      return sendErrorResponse(ctx, 500, "Failed to create user");
    }
  }

  async signIn(ctx: Context) {
    try {
      const loginData = ctx.request.body;
      const validatedData = loginSchema.parse(loginData);

      const result = await this.authService.signIn(validatedData);

      if (!result.success) {
        return sendErrorResponse(ctx, 401, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(ctx, 400, "Validation failed");
      }
      return sendErrorResponse(ctx, 500, "Login failed");
    }
  }

  async changePassword(ctx: Context) {
    try {
      const passwordData = ctx.request.body;
      const validatedData = changePasswordSchema.parse(passwordData);
      const userId = ctx.state.user.id;
      const result = await this.authService.changePassword(
        userId,
        validatedData
      );

      if (!result.success) {
        const status =
          result.error === "Current password is incorrect" ? 400 : 500;
        return sendErrorResponse(ctx, status, result.error!);
      }

      return sendSuccessResponse(ctx, 200, {
        message: "Password changed successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return sendErrorResponse(ctx, 400, `Validation failed: ${error.message}`);
      }
      return sendErrorResponse(ctx, 500, "Failed to change password");
    }
  }
}
