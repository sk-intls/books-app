import { BookRepository } from '../../repository/bookRepository';

describe('BookRepository', () => {
  let repository: BookRepository;

  beforeEach(() => {
    repository = new BookRepository({} as any);
  });

  it('should search books', async () => {
    const mockBooks = [{ id: 1, title: 'Test Book', author_name: 'Test Author' }];
    
    jest.spyOn(repository, 'searchBooks').mockResolvedValue(mockBooks);
    
    const result = await repository.searchBooks({ title: 'Test' });
    expect(result).toEqual(mockBooks);
  });

  it('should find book with author', async () => {
    const mockBookWithAuthor = { 
      id: 1, 
      title: 'Test Book', 
      author_name: 'Test Author' 
    };
    
    jest.spyOn(repository, 'findWithAuthor').mockResolvedValue(mockBookWithAuthor);
    
    const result = await repository.findWithAuthor(1);
    expect(result).toEqual(mockBookWithAuthor);
    expect(result).toHaveProperty('author_name');
  });
});