import { Book, CreateBookData } from "../models/bookSchema";
import { User } from "../models/userSchema";
import { BookRepository } from "../repository/bookRepository";
import { UserRepository } from "../repository/userRepository";

interface BookResult {
  success: boolean;
  book?: Book;
  error?: string;
}

interface UsersResult {
  success: boolean;
  users?: any[];
  error?: string;
}

export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private userRepository: UserRepository
  ) {}

  async addNewBook(
    bookData: CreateBookData,
    userId?: number
  ): Promise<BookResult> {
    try {
      // If adding to catalog (no user)
      if (!userId) {
        const existingCatalogBook = await this.bookRepository.findOneBy({
          title: bookData.title,
          author: bookData.author,
          user_id: null, // Only check unowned books
        });

        if (existingCatalogBook) {
          return { success: false, error: "Book already exists in catalog" };
        }
      }
      // If adding to catalog and assign to a user
      else {
        const usersWithThisBook =
          await this.bookRepository.findUsersByTitleAndAuthor(
            bookData.title,
            bookData.author
          );
        const userHasThisBook = usersWithThisBook.some(
          (user) => user.id === userId
        );

        if (userHasThisBook) {
          return { success: false, error: "You already own this book" };
        }
      }

      const newBook = await this.bookRepository.create({
        ...bookData,
        user_id: userId || null,
      });

      return {
        success: true,
        book: newBook,
      };
    } catch (error) {
      return { success: false, error: "Failed to add book" };
    }
  }

  async getBookHolder(bookId: number): Promise<User | null> {
    try {
      const bookWithUser = await this.bookRepository.findByIdWithUser(bookId);

      if (!bookWithUser) {
        throw new Error("Book not found");
      }

      if (!bookWithUser.user_id) {
        return null;
      }

      if (bookWithUser.user) {
        return {
          id: bookWithUser.user.id,
          username: bookWithUser.user.username,
          first_name: bookWithUser.user.first_name,
          last_name: bookWithUser.user.last_name,
        } as User;
      }

      // Fallback: separate query if join didn't work
      const user = await this.userRepository.findOne(bookWithUser.user_id);
      return user || null;
    } catch (error) {
      throw new Error("Failed to check the ownership");
    }
  }

  async addBookToUser(
    bookId: number,
    userId: number
  ): Promise<Book | undefined> {
    return this.updateBookOwnership(bookId, userId, "add");
  }

  async removeBookFromUser(
    bookId: number,
    userId: number
  ): Promise<Book | undefined> {
    return this.updateBookOwnership(bookId, userId, "remove");
  }

  async findUsersByAuthor(authorName: string): Promise<UsersResult> {
    return this.findUsersByBookCriteria({ author: authorName });
  }

  async findUsersByTitle(bookTitle: string): Promise<UsersResult> {
    return this.findUsersByBookCriteria({ title: bookTitle });
  }

  async findUsersByBook(
    bookTitle: string,
    authorName: string
  ): Promise<UsersResult> {
    return this.findUsersByBookCriteria({
      title: bookTitle,
      author: authorName,
    });
  }


  private async validateBookExists(bookId: number): Promise<Book> {
    const existingBook = await this.bookRepository.findOneBy({ id: bookId });
    if (!existingBook || !existingBook.id) {
      throw new Error("Book not found");
    }
    return existingBook;
  }

  private async validateBookAndUser(
    bookId: number,
    userId: number
  ): Promise<{ book: Book; user: User }> {
    const existingBook = await this.bookRepository.findOneBy({ id: bookId });
    const existingUser = await this.userRepository.findOneBy({ id: userId });

    if (
      !existingBook ||
      !existingUser ||
      !existingBook.id ||
      !existingUser.id
    ) {
      throw new Error("No such book or user");
    }

    return { book: existingBook, user: existingUser };
  }

  private async updateBookOwnership(
    bookId: number,
    userId: number,
    action: "add" | "remove"
  ): Promise<Book | undefined> {
    try {
      const { book, user } = await this.validateBookAndUser(bookId, userId);

      const isBookOwnedByUser = await this.bookRepository.isBookOwnedByUser(
        bookId,
        userId
      );

      if (action === "add" && isBookOwnedByUser) {
        throw new Error("Book already owned by user");
      }
      if (action === "remove" && !isBookOwnedByUser) {
        throw new Error("Book is not owned by user");
      }

      const newOwner = action === "add" ? user.id! : null;
      await this.bookRepository.updateBookOwner(book.id!, newOwner);
      return await this.bookRepository.findOne(book.id!);
    } catch (error) {
      const actionText =
        action === "add" ? "assign book to" : "remove book from";
      throw new Error(`Could not ${actionText} user`);
    }
  }

  private async findUsersByBookCriteria(criteria: {
    title?: string;
    author?: string;
  }): Promise<UsersResult> {
    try {
      if (!criteria.title && !criteria.author) {
        return {
          success: false,
          error: "Must provide either title, author, or both",
        };
      }

      let users: any[];
      let searchDescription: string;

      if (criteria.title && criteria.author) {
        users = await this.bookRepository.findUsersByTitleAndAuthor(
          criteria.title,
          criteria.author
        );
        searchDescription = `"${criteria.title}" by ${criteria.author}`;
      } else if (criteria.title) {
        users = await this.bookRepository.findUsersByTitle(criteria.title);
        searchDescription = `"${criteria.title}"`;
      } else {
        users = await this.bookRepository.findUsersByAuthor(criteria.author!);
        searchDescription = `books by ${criteria.author}`;
      }

      return {
        success: true,
        users,
      };
    } catch (error) {
      const searchDescription =
        criteria.title && criteria.author
          ? `"${criteria.title}" by ${criteria.author}`
          : criteria.title
          ? `"${criteria.title}"`
          : `books by ${criteria.author}`;

      return {
        success: false,
        error: `Failed to find users with ${searchDescription}`,
      };
    }
  }
}
