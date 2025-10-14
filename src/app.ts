import Router from "@koa/router";
import Koa, { Context } from "koa";
import { UserRepository } from "./repository/userRepository";
import { db } from "../config/knex";

const app = new Koa();
const router = new Router();
app.context.db = {
  users: new UserRepository(db),
};

router.get("/", async (ctx: Context) => {
  try {
    const users = await ctx.app.context.db.users.find({}); // smoke test
    ctx.body = users;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch users" };
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
