import { Context, Next } from "koa";
import * as jwt from "jsonwebtoken";
import { getJwtSecret } from "../utils/auth";

interface UserPayload {
  id: number;
  username: string;
}

export const authenticateToken = async (ctx: Context, next: Next) => {
  try {
    const authHeader = ctx.headers.authorization;
    console.log(ctx.headers)
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      ctx.status = 401;
      ctx.body = { error: "Access token required" };
      return;
    }

    const decoded = jwt.verify(token, getJwtSecret()) as UserPayload;
    ctx.state.user = decoded;

    await next();
  } catch (error) {
    ctx.status = 403;
    ctx.body = { error: "Invalid or expired token" };
  }
};
