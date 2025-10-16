import { Repository } from "./Repository";
import { Book } from "../models/bookSchema";

export class BookRepository extends Repository<Book> {
  tableName = "books";

  async searchBooks(criteria?: {
    title?: string;
    authorId?: number;
    includeAuthor?: boolean;
  }): Promise<any[]> {
    let query = this.db
      .select([
        "books.*",
        ...(criteria?.includeAuthor ? ["authors.name as author_name"] : [])
      ])
      .from("books");

    if (criteria?.includeAuthor) {
      query = query.join("authors", "books.author_id", "authors.id");
    }

    if (criteria?.title) {
      query = query.where("books.title", "ilike", `%${criteria.title}%`);
    }

    if (criteria?.authorId) {
      query = query.where("books.author_id", criteria.authorId);
    }

    return query.orderBy("books.created_at", "desc");
  }

  // Get a single book with author information
  async findWithAuthor(bookId: number): Promise<any> {
    return this.db
      .select([
        "books.*",
        "authors.name as author_name"
      ])
      .from("books")
      .join("authors", "books.author_id", "authors.id")
      .where("books.id", bookId)
      .first();
  }

}
