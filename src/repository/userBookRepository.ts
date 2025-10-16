import { Repository } from "./Repository";
import { UserBook } from "../models/userBookSchema";

export class UserBookRepository extends Repository<UserBook> {
  tableName = "user_books";

  async addBookToUser(userId: number, bookId: number): Promise<UserBook> {
    return this.create({
      user_id: userId,
      book_id: bookId,
    });
  }

  async removeBookFromUser(userId: number, bookId: number): Promise<boolean> {
    const deleted = await this.qb
      .where({ user_id: userId, book_id: bookId })
      .delete();
    return deleted > 0;
  }

  async userOwnsBook(userId: number, bookId: number): Promise<boolean> {
    const result = await this.qb
      .where({ user_id: userId, book_id: bookId })
      .first();
    return !!result;
  }

  async getUserBooks(userId: number): Promise<any[]> {
    return this.db
      .select([
        "books.id",
        "books.title", 
        "books.author_id",
        "books.created_at",
        "books.updated_at",
        "authors.name as author_name",
        "user_books.acquired_at"
      ])
      .from("user_books")
      .join("books", "user_books.book_id", "books.id")
      .join("authors", "books.author_id", "authors.id")
      .where("user_books.user_id", userId)
      .orderBy("user_books.acquired_at", "desc");
  }

  async getBookOwners(bookId: number): Promise<any[]> {
    return this.db
      .select([
        "users.id",
        "users.username",
        "users.first_name", 
        "users.last_name",
        "user_books.acquired_at"
      ])
      .from("user_books")
      .join("users", "user_books.user_id", "users.id")
      .where("user_books.book_id", bookId)
      .orderBy("user_books.acquired_at", "desc");
  }

  async searchUsersByBooks(criteria?: {
    authorName?: string;
    bookTitle?: string;
  }): Promise<any[]> {
    let query = this.db
      .select([
        "users.id",
        "users.username",
        "users.first_name",
        "users.last_name",
        this.db.raw("COUNT(DISTINCT books.id) as book_count")
      ])
      .from("user_books")
      .join("books", "user_books.book_id", "books.id")
      .join("users", "user_books.user_id", "users.id");

    // Add author join and filter if needed
    if (criteria?.authorName) {
      query = query
        .join("authors", "books.author_id", "authors.id")
        .where("authors.name", "ilike", `%${criteria.authorName}%`);
    }

    // Add book title filter if needed
    if (criteria?.bookTitle) {
      // If we already have author filter, use andWhere
      if (criteria.authorName) {
        query = query.andWhere("books.title", "ilike", `%${criteria.bookTitle}%`);
      } else {
        query = query.where("books.title", "ilike", `%${criteria.bookTitle}%`);
      }
    }

    return query
      .groupBy("users.id", "users.username", "users.first_name", "users.last_name")
      .orderBy("book_count", "desc");
  }

}