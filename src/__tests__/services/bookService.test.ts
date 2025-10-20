import { BookService } from '../../services/bookService';
import { BookRepository } from '../../repository/bookRepository';
import { AuthorRepository } from '../../repository/authorRepository';
import { UserBookRepository } from '../../repository/userBookRepository';

jest.mock('../../repository/bookRepository');
jest.mock('../../repository/authorRepository');
jest.mock('../../repository/userBookRepository');

describe('BookService', () => {
  let service: BookService;
  let mockBookRepo: jest.Mocked<BookRepository>;
  let mockAuthorRepo: jest.Mocked<AuthorRepository>;
  let mockUserBookRepo: jest.Mocked<UserBookRepository>;

  beforeEach(() => {
    mockBookRepo = new BookRepository({} as any) as jest.Mocked<BookRepository>;
    mockAuthorRepo = new AuthorRepository({} as any) as jest.Mocked<AuthorRepository>;
    mockUserBookRepo = new UserBookRepository({} as any) as jest.Mocked<UserBookRepository>;
    
    service = new BookService(mockBookRepo, mockAuthorRepo, mockUserBookRepo);
    jest.clearAllMocks();
  });

  describe('addBook', () => {
    it('should add a new book successfully', async () => {
      const bookData = { title: 'Test Book', authorName: 'Test Author' };
      const mockAuthor = { id: 1, name: 'Test Author' };
      const mockBook = { id: 1, title: 'Test Book', author_id: 1 };

      mockAuthorRepo.findOrCreate.mockResolvedValue(mockAuthor as any);
      mockBookRepo.searchBooks.mockResolvedValue([]);
      mockBookRepo.create.mockResolvedValue(mockBook as any);

      const result = await service.addBook(bookData);

      expect(result.success).toBe(true);
      expect(result.book).toEqual(mockBook);
      expect(mockAuthorRepo.findOrCreate).toHaveBeenCalledWith({ name: 'Test Author' });
    });

    it('should return error if book already exists', async () => {
      const bookData = { title: 'Test Book', authorName: 'Test Author' };
      const mockAuthor = { id: 1, name: 'Test Author' };
      const existingBook = { id: 1, title: 'Test Book', author_id: 1 };

      mockAuthorRepo.findOrCreate.mockResolvedValue(mockAuthor as any);
      mockBookRepo.searchBooks.mockResolvedValue([existingBook]);

      const result = await service.addBook(bookData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Book already exists in catalog');
    });
  });

  describe('searchBooks', () => {
    it('should search books by title', async () => {
      const criteria = { title: 'Test' };
      const mockBooks = [{ id: 1, title: 'Test Book', author_id: 1 }];

      mockBookRepo.searchBooks.mockResolvedValue(mockBooks);

      const result = await service.searchBooks(criteria);

      expect(result.success).toBe(true);
      expect(result.books).toEqual(mockBooks);
    });

    it('should search books by author name', async () => {
      const criteria = { authorName: 'Test Author' };
      const mockAuthor = { id: 1, name: 'Test Author' };
      const mockBooks = [{ id: 1, title: 'Test Book', author_id: 1 }];

      mockAuthorRepo.findOneBy.mockResolvedValue(mockAuthor as any);
      mockBookRepo.searchBooks.mockResolvedValue(mockBooks);

      const result = await service.searchBooks(criteria);

      expect(result.success).toBe(true);
      expect(result.books).toEqual(mockBooks);
    });
  });

  describe('updateBook', () => {
    it('should update book successfully', async () => {
      const bookId = 1;
      const updateData = { title: 'Updated Title' };
      const existingBook = { id: 1, title: 'Old Title', author_id: 1 };
      const updatedBook = { id: 1, title: 'Updated Title', author_id: 1 };

      mockBookRepo.findOne.mockResolvedValue(existingBook as any);
      mockBookRepo.update.mockResolvedValue(true);
      mockBookRepo.findOne.mockResolvedValueOnce(existingBook as any).mockResolvedValueOnce(updatedBook as any);

      const result = await service.updateBook(bookId, updateData);

      expect(result.success).toBe(true);
      expect(result.book).toEqual(updatedBook);
    });

    it('should return error if book not found', async () => {
      const bookId = 999;
      const updateData = { title: 'Updated Title' };

      mockBookRepo.findOne.mockResolvedValue(null as any);

      const result = await service.updateBook(bookId, updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Book not found');
    });
  });
});