import { Repository } from "./Repository";
import { Book, BookWithUser } from "../models/bookSchema";

export class BookRepository extends Repository<Book> {
  tableName = "books";

  async findByUserId(userId: number): Promise<Book[]> {
    return this.qb.where({ user_id: userId }).select("*");
  }

  async findByAuthor(authorName: string): Promise<BookWithUser[]> {
    return this.qb
      .select([
        "books.*",
        "users.id as user_id",
        "users.username",
        "users.first_name",
        "users.last_name"
      ])
      .join("users", "books.user_id", "users.id")
      .where("books.author", "ilike", `%${authorName}%`)
      .then(rows => 
        rows.map(row => ({
          id: row.id,
          title: row.title,
          author: row.author,
          user_id: row.user_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user: {
            id: row.user_id,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name
          }
        }))
      );
  }

  async findByTitle(title: string, userId: number): Promise<Book[]> {
    return this.qb
      .where("title", "ilike", `%${title}%`)
      .andWhere({ user_id: userId })
      .select("*");
  }

  async findUsersByAuthor(authorName: string): Promise<any[]> {
    return this.db
      .select([
        "users.id",
        "users.username", 
        "users.first_name",
        "users.last_name",
        this.db.raw("COUNT(books.id) as book_count")
      ])
      .from("users")
      .join("books", "users.id", "books.user_id")
      .where("books.author", "ilike", `%${authorName}%`)
      .groupBy("users.id", "users.username", "users.first_name", "users.last_name")
      .orderBy("book_count", "desc");
  }

  async updateAuthorName(oldAuthor: string, newAuthor: string): Promise<number> {
    return this.qb
      .where("author", "ilike", oldAuthor)
      .update({ 
        author: newAuthor,
        updated_at: new Date()
      });
  }

  async findByIdWithUser(bookId: number): Promise<BookWithUser | undefined> {
    const rows = await this.qb
      .select([
        "books.*",
        "users.id as owner_id",
        "users.username",
        "users.first_name", 
        "users.last_name"
      ])
      .join("users", "books.user_id", "users.id")
      .where("books.id", bookId)
      .first();

    if (!rows) return undefined;

    return {
      id: rows.id,
      title: rows.title,
      author: rows.author,
      user_id: rows.user_id,
      created_at: rows.created_at,
      updated_at: rows.updated_at,
      user: {
        id: rows.owner_id,
        username: rows.username,
        first_name: rows.first_name,
        last_name: rows.last_name
      }
    };
  }

  async isBookOwnedByUser(bookId: number, userId: number): Promise<boolean> {
    const result = await this.qb
      .where({ id: bookId, user_id: userId })
      .first();
    return !!result;
  }

  async getBookCountByAuthor(): Promise<Array<{author: string, count: number}>> {
    return this.qb
      .select("author")
      .count("* as count")
      .groupBy("author")
      .orderBy("count", "desc")
      .then(rows => 
        rows.map(row => ({
          author: row.author,
          count: parseInt(row.count as string)
        }))
      );
  }
}