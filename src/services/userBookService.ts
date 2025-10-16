import { UserBook } from "../models/userBookSchema";
import { BookRepository } from "../repository/bookRepository";
import { UserRepository } from "../repository/userRepository";
import { UserBookRepository } from "../repository/userBookRepository";

interface UserBookResult {
  success: boolean;
  userBook?: UserBook;
  error?: string;
  message?: string;
}

interface BooksResult {
  success: boolean;
  books?: any[];
  error?: string;
}

interface UsersResult {
  success: boolean;
  users?: any[];
  error?: string;
}

export class UserBookService {
  constructor(
    private userBookRepository: UserBookRepository,
    private bookRepository: BookRepository,
    private userRepository: UserRepository
  ) {}

  async addBookToUser(bookId: number, userId: number): Promise<UserBookResult> {
    try {
      const book = await this.bookRepository.findOne(bookId);
      const user = await this.userRepository.findOne(userId);

      if (!book || !user) {
        return { success: false, error: "Book or user not found" };
      }

      const alreadyOwns = await this.userBookRepository.userOwnsBook(
        userId,
        bookId
      );
      if (alreadyOwns) {
        return { success: false, error: "User already owns this book" };
      }

      const userBook = await this.userBookRepository.addBookToUser(
        userId,
        bookId
      );
      return {
        success: true,
        userBook,
        message: "Book successfully added to user's collection",
      };
    } catch (error) {
      return { success: false, error: "Failed to add book to user" };
    }
  }

  async removeBookFromUser(
    bookId: number,
    userId: number
  ): Promise<UserBookResult> {
    try {
      const book = await this.bookRepository.findOne(bookId);
      if (!book) {
        return { success: false, error: "Book not found" };
      }

      const owns = await this.userBookRepository.userOwnsBook(userId, bookId);
      if (!owns) {
        return { success: false, error: "User does not own this book" };
      }

      const removed = await this.userBookRepository.removeBookFromUser(
        userId,
        bookId
      );
      if (!removed) {
        return { success: false, error: "Failed to remove book" };
      }

      return {
        success: true,
        message: "Book successfully removed from user's collection",
      };
    } catch (error) {
      return { success: false, error: "Failed to remove book from user" };
    }
  }

  async userOwnsBook(
    userId: number,
    bookId: number
  ): Promise<{ success: boolean; owns?: boolean; error?: string }> {
    try {
      const owns = await this.userBookRepository.userOwnsBook(userId, bookId);
      return { success: true, owns };
    } catch (error) {
      return { success: false, error: "Failed to check book ownership" };
    }
  }

  async getUserBooks(userId: number): Promise<BooksResult> {
    try {
      const user = await this.userRepository.findOne(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const books = await this.userBookRepository.getUserBooks(userId);
      return { success: true, books };
    } catch (error) {
      return { success: false, error: "Failed to get user books" };
    }
  }

  async getBookOwners(bookId: number): Promise<UsersResult> {
    try {
      const book = await this.bookRepository.findOne(bookId);
      if (!book) {
        return { success: false, error: "Book not found" };
      }

      const users = await this.userBookRepository.getBookOwners(bookId);
      return { success: true, users };
    } catch (error) {
      return { success: false, error: "Failed to get book owners" };
    }
  }

  
  async searchUsers(criteria?: {
    authorName?: string;
    bookTitle?: string;
  }): Promise<UsersResult> {
    try {
      if (!criteria || (!criteria.authorName && !criteria.bookTitle)) {
        return { success: false, error: "At least one search criterion is required" };
      }

      const users = await this.userBookRepository.searchUsersByBooks(criteria);
      return { success: true, users };
    } catch (error) {
      const criteriaStr = [];
      if (criteria?.authorName) criteriaStr.push(`author "${criteria.authorName}"`);
      if (criteria?.bookTitle) criteriaStr.push(`book "${criteria.bookTitle}"`);
      
      return {
        success: false,
        error: `Failed to find users with ${criteriaStr.join(" and ")}`,
      };
    }
  }

}
