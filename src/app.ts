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
import { UserController } from "./controllers/userController";
import { BookController } from "./controllers/bookController";
import { getJwtSecret } from "./utils/auth";
import { authenticateToken } from "./middleware/authMiddleware";
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
const userController = new UserController(userRepository, userBookService);
const bookController = new BookController(bookService);

getJwtSecret();

router.post("/signup", (ctx: Context) => authController.signUp(ctx));
router.post("/signin", (ctx: Context) => authController.signIn(ctx));

// Public routes
router.get("/books/search", (ctx: Context) => bookController.searchBooks(ctx));
router.put("/books/:id", (ctx: Context) => bookController.updateBook(ctx));
router.get("/users", (ctx: Context) => userController.getAllUsers(ctx));
router.get("/users/search", (ctx: Context) => userController.searchUsers(ctx));
router.get("/users/:id", (ctx: Context) => userController.getUserProfile(ctx));
router.get("/users/:id/books", (ctx: Context) => userController.getUserBooks(ctx));

// Protected routes
router.put("/change-password", authenticateToken, (ctx: Context) => authController.changePassword(ctx));
router.get("/me", authenticateToken, (ctx: Context) => userController.getMyProfile(ctx));
router.get("/me/books", authenticateToken, (ctx: Context) => userController.getMyBooks(ctx));
router.post("/me/books/add", authenticateToken, (ctx: Context) => userController.addBookToMe(ctx));
router.delete("/me/books/:bookId/remove", authenticateToken, (ctx: Context) => userController.removeBookFromMe(ctx));

app.use(router.routes());

app.listen(3000, () => {
  console.log(__dirname, __filename);
  console.log("server is running on port 300");
});
