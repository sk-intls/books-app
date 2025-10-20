import { Context } from 'koa';
import { UserController } from '../../controllers/userController';
import { UserRepository } from '../../repository/userRepository';
import { UserBookService } from '../../services/userBookService';

jest.mock('../../repository/userRepository');
jest.mock('../../services/userBookService');

describe('UserController', () => {
  let controller: UserController;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserBookService: jest.Mocked<UserBookService>;
  let ctx: Partial<Context>;

  beforeEach(() => {
    mockUserRepository = new UserRepository({} as any) as jest.Mocked<UserRepository>;
    mockUserBookService = new UserBookService({} as any, {} as any, {} as any) as jest.Mocked<UserBookService>;
    controller = new UserController(mockUserRepository, mockUserBookService);
    
    ctx = {
      state: { user: { id: 1 } },
      request: { body: {} } as any,
      params: {},
      status: undefined,
      body: undefined
    };

    jest.clearAllMocks();
  });

  it('should get user profile successfully', async () => {
    const mockUser = { id: 1, username: 'testuser', first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };
    mockUserRepository.findOnePublic.mockResolvedValue(mockUser);

    await controller.getMyProfile(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({ user: mockUser });
  });

  it('should get user books successfully', async () => {
    const mockBooks = [{ id: 1, title: 'Test Book', author_id: 1, author_name: 'Test Author' }];
    mockUserBookService.getUserBooks.mockResolvedValue({
      success: true,
      books: mockBooks as any
    });

    await controller.getMyBooks(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({ books: mockBooks });
  });

  it('should add book to user successfully', async () => {
    ctx.request!.body = { bookId: 1 };
    const mockUserBook = { id: 1, user_id: 1, book_id: 1 };
    mockUserBookService.addBookToUser.mockResolvedValue({
      success: true,
      message: 'Book added to collection',
      userBook: mockUserBook as any
    });

    await controller.addBookToMe(ctx as Context);

    expect(ctx.status).toBe(201);
    expect(ctx.body).toEqual({
      message: 'Book added to collection',
      userBook: mockUserBook
    });
  });

  it('should get all users successfully', async () => {
    const mockUsers = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
    mockUserRepository.findAllPublic.mockResolvedValue(mockUsers as any);

    await controller.getAllUsers(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({
      users: mockUsers,
      count: 2
    });
  });

  it('should get user profile by id successfully', async () => {
    const mockUser = { id: 2, username: 'otheruser', first_name: 'Jane', last_name: 'Doe', birth_date: '1995-01-01' };
    ctx.params = { id: '2' };
    mockUserRepository.findOnePublic.mockResolvedValue(mockUser);

    await controller.getUserProfile(ctx as Context);

    expect(ctx.status).toBe(200);
    expect(ctx.body).toEqual({ user: mockUser });
  });

  it('should return 400 for invalid user id', async () => {
    ctx.params = { id: 'invalid' };

    await controller.getUserProfile(ctx as Context);

    expect(ctx.status).toBe(400);
    expect(ctx.body).toHaveProperty('error', 'Invalid user ID');
  });
});