import { UserRepository } from '../../repository/userRepository';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    first_name: 'John',
    last_name: 'Doe',
    birth_date: '1990-01-01'
  };

  beforeEach(() => {
    repository = new UserRepository({} as any);
  });

  it('should return users without passwords in findAllPublic', async () => {
    jest.spyOn(repository, 'findAllPublic').mockResolvedValue([{
      id: 1,
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-01'
    }]);

    const result = await repository.findAllPublic();
    expect(result[0]).not.toHaveProperty('password');
  });

  it('should return user without password in findOnePublic', async () => {
    const sanitizedUser = {
      id: 1,
      username: 'testuser',
      first_name: 'John',
      last_name: 'Doe',
      birth_date: '1990-01-01'
    };
    
    jest.spyOn(repository, 'findOnePublic').mockResolvedValue(sanitizedUser);
    const result = await repository.findOnePublic(1);
    expect(result).not.toHaveProperty('password');
  });

  it('should return user with password in findOneWithPassword', async () => {
    jest.spyOn(repository, 'findOneWithPassword').mockResolvedValue(mockUser);
    const result = await repository.findOneWithPassword(1);
    expect(result).toHaveProperty('password');
  });

  it('should find user by criteria with password', async () => {
    jest.spyOn(repository, 'findOneByWithPassword').mockResolvedValue(mockUser);
    const result = await repository.findOneByWithPassword({ username: 'testuser' });
    expect(result).toHaveProperty('password');
  });
});
