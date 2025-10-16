import { Book } from "../models/bookSchema";
import { BookRepository } from "../repository/bookRepository";
import { AuthorRepository } from "../repository/authorRepository";
import { UserBookRepository } from "../repository/userBookRepository";

interface BookResult {
  success: boolean;
  book?: Book;
  error?: string;
  message?: string;
}

export class BookService {
  constructor(
    private bookRepository: BookRepository,
    private authorRepository: AuthorRepository,
    private userBookRepository: UserBookRepository
  ) {}

  async addBook(bookData: {
    title: string;
    authorName: string;
  }): Promise<BookResult> {
    try {
      const author = await this.authorRepository.findOrCreate({
        name: bookData.authorName,
      });

      const existingBooks = await this.bookRepository.searchBooks({
        title: bookData.title,
        authorId: author.id,
      });

      if (existingBooks.length > 0) {
        return { success: false, error: "Book already exists in catalog" };
      }

      const newBook = await this.bookRepository.create({
        title: bookData.title,
        author_id: author.id!,
      });

      return {
        success: true,
        book: newBook,
      };
    } catch (error) {
      return { success: false, error: "Failed to add book" };
    }
  }

  async removeBook(bookData: {
    title: string;
    authorName: string;
  }): Promise<BookResult> {
    try {
      const author = await this.authorRepository.findOneBy({
        name: bookData.authorName,
      });

      if (!author || !author.id) {
        return { success: false, error: "Author not found in catalog" };
      }

      const [book] = await this.bookRepository.searchBooks({
        title: bookData.title,
        authorId: author.id,
      });

      if (!book || !book.id) {
        return { success: false, error: "Book not found in catalog" };
      }

      const owners = await this.userBookRepository.getBookOwners(book.id);

      if (owners.length > 0) {
        return {
          success: false,
          error: `Cannot remove book: ${owners.length} user(s) own this book`,
        };
      }

      await this.bookRepository.delete(book.id);

      return {
        success: true,
        book,
        message: "Book successfully removed from catalog",
      };
    } catch (error) {
      return { success: false, error: "Failed to remove book" };
    }
  }

  async updateBook(
    bookId: number,
    updateData: {
      title?: string;
      authorName?: string;
    }
  ): Promise<BookResult> {
    try {
      const book = await this.bookRepository.findOne(bookId);
      if (!book) {
        return { success: false, error: "Book not found" };
      }

      const updateFields: any = {};

      if (updateData.title !== undefined) {
        updateFields.title = updateData.title;
      }

      if (updateData.authorName !== undefined) {
        const author = await this.authorRepository.findOrCreate({
          name: updateData.authorName,
        });
        updateFields.author_id = author.id;
      }

      if (Object.keys(updateFields).length === 0) {
        return { success: false, error: "No fields provided to update" };
      }

      const updatedRows = await this.bookRepository.update(
        bookId,
        updateFields
      );

      if (!updatedRows) {
        return { success: false, error: "Failed to update book" };
      }

      const updatedBook = await this.bookRepository.findOne(bookId);
      return {
        success: true,
        book: updatedBook,
        message: "Book successfully updated",
      };
    } catch (error) {
      return { success: false, error: "Failed to update book" };
    }
  }

  async searchBooks(criteria?: {
    title?: string;
    authorName?: string;
  }): Promise<BookResult & { books?: Book[] }> {
    try {
      let searchCriteria: any = { includeAuthor: true };

      if (criteria?.title) {
        searchCriteria.title = criteria.title;
      }

      if (criteria?.authorName) {
        const author = await this.authorRepository.findOneBy({
          name: criteria.authorName,
        });

        if (!author) {
          return { success: true, books: [] };
        }

        searchCriteria.authorId = author.id;
      }

      const books = await this.bookRepository.searchBooks(searchCriteria);
      return { success: true, books };
    } catch (error) {
      return { success: false, error: "Failed to search books" };
    }
  }
}
