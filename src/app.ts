import Router from "@koa/router";
import Koa, { Context } from "koa";
import { UserRepository } from "./repository/userRepository";
import { BookRepository } from "./repository/bookRepository";
import { AuthorRepository } from "./repository/authorRepository";
import { UserBookRepository } from "./repository/userBookRepository";
import { db } from "../config/knex";
import koaBody from "@koa/bodyparser";
import { AuthService } from "./services/authService";
import { BookService } from "./services/bookService";
import { AuthController } from "./controllers/authController";
import { getJwtSecret } from "./utils/auth";
import dotenv from "dotenv";
import { UserBookService } from "./services/userBookService";
dotenv.config();

const app = new Koa();
const router = new Router();
app.use(koaBody());

// Initialize repositories
const userRepository = new UserRepository(db);
const bookRepository = new BookRepository(db);
const authorRepository = new AuthorRepository(db);
const userBookRepository = new UserBookRepository(db);

// Initialize services
const authService = new AuthService(userRepository);
const bookService = new BookService(
  bookRepository,
  authorRepository,
  userBookRepository
);
const userBookService = new UserBookService(
  userBookRepository,
  bookRepository,
  userRepository
);

// Initialize controllers
const authController = new AuthController(authService);

getJwtSecret();

router.post("/signup", (ctx: Context) => authController.signUp(ctx));
router.post("/signin", (ctx: Context) => authController.signIn(ctx));

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
