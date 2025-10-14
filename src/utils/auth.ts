import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Context } from "koa";

interface UserPayload {
  id: number;
  username: string;
}

interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env file");
  }
  return secret;
};

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const formatUserResponse = (user: any): UserResponse => {
  return {
    id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
  };
};

export const sendErrorResponse = (ctx: Context, status: number, message: string) => {
  ctx.status = status;
  ctx.body = { error: message };
};

export const sendSuccessResponse = (ctx: Context, status: number, data: any) => {
  ctx.status = status;
  ctx.body = data;
};