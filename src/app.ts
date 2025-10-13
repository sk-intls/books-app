import Router from "@koa/router";
import Koa, { Context } from "koa";

const app = new Koa();
const router = new Router();

router.get("/", (ctx: Context) => {
  ctx.body = "hello world";
});

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
