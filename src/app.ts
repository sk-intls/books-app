import Router from "@koa/router";
import Koa, { Context } from "koa";
import { UserRepository } from "./repository/userRepository";
import { db } from "../config/knex";
import koaBody from "@koa/bodyparser";
import { userSchema } from "./models/userSchema";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const app = new Koa();
const router = new Router();
app.use(koaBody());
app.context.db = {
  users: new UserRepository(db),
};

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

router.post("/signup", async (ctx: Context) => {
  try {
    const userData = ctx.request.body;
    const validatedData = userSchema.parse(userData);

    const existingUsers = await ctx.app.context.db.users.find({
      username: validatedData.username
    });
    if (existingUsers.length > 0) {
      ctx.status = 409;
      ctx.body = { error: "Username is taken" };
      return;
    }
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const newUser = await ctx.app.context.db.users.create({
      username: validatedData.username,
      password: hashedPassword,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      birth_date: validatedData.birth_date,
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      ctx.status = 500;
      ctx.body = { error: "Server configuration error" };
      return;
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      jwtSecret,
      { expiresIn: "7d" }
    );

    ctx.status = 201;
    ctx.body = {
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.status = 400;
      ctx.body = { error: "Validation failed", details: error.message };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Failed to create user" };
    }
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
