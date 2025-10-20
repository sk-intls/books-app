import { UserBookRepository } from '../../repository/userBookRepository';

describe('UserBookRepository', () => {
  let repository: UserBookRepository;

  beforeEach(() => {
    repository = new UserBookRepository({} as any);
  });

  it('should add book to user', async () => {
    const mockUserBook = { id: 1, user_id: 1, book_id: 1, acquired_at: new Date() };
    
    jest.spyOn(repository, 'addBookToUser').mockResolvedValue(mockUserBook);
    
    const result = await repository.addBookToUser(1, 1);
    expect(result).toEqual(mockUserBook);
    expect(result.user_id).toBe(1);
    expect(result.book_id).toBe(1);
  });

  it('should check if user owns book', async () => {
    jest.spyOn(repository, 'userOwnsBook').mockResolvedValue(true);
    
    const result = await repository.userOwnsBook(1, 1);
    expect(result).toBe(true);
  });
});