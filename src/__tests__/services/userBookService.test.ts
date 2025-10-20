import { UserBookService } from '../../services/userBookService';
import { UserBookRepository } from '../../repository/userBookRepository';
import { BookRepository } from '../../repository/bookRepository';
import { UserRepository } from '../../repository/userRepository';

jest.mock('../../repository/userBookRepository');
jest.mock('../../repository/bookRepository');
jest.mock('../../repository/userRepository');

describe('UserBookService', () => {
  let service: UserBookService;
  let mockUserBookRepo: jest.Mocked<UserBookRepository>;
  let mockBookRepo: jest.Mocked<BookRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserBookRepo = new UserBookRepository({} as any) as jest.Mocked<UserBookRepository>;
    mockBookRepo = new BookRepository({} as any) as jest.Mocked<BookRepository>;
    mockUserRepo = new UserRepository({} as any) as jest.Mocked<UserRepository>;
    
    service = new UserBookService(mockUserBookRepo, mockBookRepo, mockUserRepo);
    jest.clearAllMocks();
  });

  describe('addBookToUser', () => {
    it('should add book to user successfully', async () => {
      const bookId = 1;
      const userId = 1;
      const mockBook = { id: 1, title: 'Test Book', author_id: 1 };
      const mockUser = { id: 1, username: 'testuser' };
      const mockUserBook = { id: 1, user_id: 1, book_id: 1 };

      mockBookRepo.findOne.mockResolvedValue(mockBook as any);
      mockUserRepo.findOne.mockResolvedValue(mockUser as any);
      mockUserBookRepo.userOwnsBook.mockResolvedValue(false);
      mockUserBookRepo.addBookToUser.mockResolvedValue(mockUserBook as any);

      const result = await service.addBookToUser(bookId, userId);

      expect(result.success).toBe(true);
      expect(result.userBook).toEqual(mockUserBook);
      expect(result.message).toBe("Book successfully added to user's collection");
    });

    it('should return error if user already owns book', async () => {
      const bookId = 1;
      const userId = 1;
      const mockBook = { id: 1, title: 'Test Book', author_id: 1 };
      const mockUser = { id: 1, username: 'testuser' };

      mockBookRepo.findOne.mockResolvedValue(mockBook as any);
      mockUserRepo.findOne.mockResolvedValue(mockUser as any);
      mockUserBookRepo.userOwnsBook.mockResolvedValue(true);

      const result = await service.addBookToUser(bookId, userId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User already owns this book');
    });

    it('should return error if book not found', async () => {
      const bookId = 999;
      const userId = 1;

      mockBookRepo.findOne.mockResolvedValue(undefined);
      mockUserRepo.findOne.mockResolvedValue({} as any);

      const result = await service.addBookToUser(bookId, userId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Book or user not found');
    });
  });

  describe('getUserBooks', () => {
    it('should get user books successfully', async () => {
      const userId = 1;
      const mockUser = { id: 1, username: 'testuser' };
      const mockBooks = [{ id: 1, title: 'Test Book', author_name: 'Test Author' }];

      mockUserRepo.findOne.mockResolvedValue(mockUser as any);
      mockUserBookRepo.getUserBooks.mockResolvedValue(mockBooks);

      const result = await service.getUserBooks(userId);

      expect(result.success).toBe(true);
      expect(result.books).toEqual(mockBooks);
    });

    it('should return error if user not found', async () => {
      const userId = 999;

      mockUserRepo.findOne.mockResolvedValue(undefined);

      const result = await service.getUserBooks(userId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('userOwnsBook', () => {
    it('should check if user owns book', async () => {
      const userId = 1;
      const bookId = 1;

      mockUserBookRepo.userOwnsBook.mockResolvedValue(true);

      const result = await service.userOwnsBook(userId, bookId);

      expect(result.success).toBe(true);
      expect(result.owns).toBe(true);
    });
  });
});