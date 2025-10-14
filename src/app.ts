import Router from "@koa/router";
import Koa, { Context } from "koa";
import { UserRepository } from "./repository/userRepository";
import { db } from "../config/knex";
import koaBody from "@koa/bodyparser";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { getJwtSecret } from "./utils/auth";
import dotenv from "dotenv";
dotenv.config();

const app = new Koa();
const router = new Router();
app.use(koaBody());

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

getJwtSecret();

router.post("/signup", (ctx: Context) => authController.signUp(ctx));
router.post("/signin", (ctx: Context) => authController.signIn(ctx));

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
