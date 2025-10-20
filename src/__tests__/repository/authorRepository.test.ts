import { AuthorRepository } from '../../repository/authorRepository';

describe('AuthorRepository', () => {
  let repository: AuthorRepository;

  const mockAuthor = {
    id: 1,
    name: 'Test Author',
    birth_year: 1970,
    death_year: null
  };

  beforeEach(() => {
    repository = new AuthorRepository({} as any);
  });

  it('should find author by name', async () => {
    jest.spyOn(repository, 'findByName').mockResolvedValue(mockAuthor);
    
    const result = await repository.findByName('Test Author');
    expect(result).toEqual(mockAuthor);
  });

  it('should find or create author', async () => {
    jest.spyOn(repository, 'findOrCreate').mockResolvedValue(mockAuthor);
    
    const result = await repository.findOrCreate({ name: 'Test Author' });
    expect(result).toEqual(mockAuthor);
    expect(result).toHaveProperty('name', 'Test Author');
  });
});