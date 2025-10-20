import { AuthService } from '../../services/authService';
import { UserRepository } from '../../repository/userRepository';
import * as authUtils from '../../utils/auth';

jest.mock('../../repository/userRepository');
jest.mock('../../utils/auth');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockHashPassword: jest.MockedFunction<typeof authUtils.hashPassword>;
  let mockComparePassword: jest.MockedFunction<typeof authUtils.comparePassword>;
  let mockGenerateToken: jest.MockedFunction<typeof authUtils.generateToken>;
  let mockFormatUserResponse: jest.MockedFunction<typeof authUtils.formatUserResponse>;

  beforeEach(() => {
    mockUserRepository = new UserRepository({} as any) as jest.Mocked<UserRepository>;
    authService = new AuthService(mockUserRepository);

    mockHashPassword = authUtils.hashPassword as jest.MockedFunction<typeof authUtils.hashPassword>;
    mockComparePassword = authUtils.comparePassword as jest.MockedFunction<typeof authUtils.comparePassword>;
    mockGenerateToken = authUtils.generateToken as jest.MockedFunction<typeof authUtils.generateToken>;
    mockFormatUserResponse = authUtils.formatUserResponse as jest.MockedFunction<typeof authUtils.formatUserResponse>;

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01'
      };

      const hashedPassword = 'hashedPassword123';
      const newUser = { id: 1, ...userData, password: hashedPassword };
      const token = 'jwt-token-123';
      const formattedUser = { id: 1, username: 'newuser', first_name: 'John', last_name: 'Doe' };

      mockUserRepository.findOneByWithPassword.mockResolvedValue(undefined); // user doesn't exist
      mockUserRepository.create.mockResolvedValue(newUser);

      mockHashPassword.mockResolvedValue(hashedPassword);
      mockGenerateToken.mockReturnValue(token);
      mockFormatUserResponse.mockReturnValue(formattedUser);

      const result = await authService.signUp(userData);

      expect(result.success).toBe(true);
      expect(result.token).toBe(token);
      expect(result.user).toBe(formattedUser);

      expect(mockUserRepository.findOneByWithPassword).toHaveBeenCalledWith({
        username: userData.username
      });
      expect(mockHashPassword).toHaveBeenCalledWith(userData.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(mockGenerateToken).toHaveBeenCalledWith({
        id: newUser.id,
        username: newUser.username
      });
      expect(mockFormatUserResponse).toHaveBeenCalledWith(newUser);
    });

    it('should return error if username is taken', async () => {
      const userData = {
        username: 'existinguser',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01'
      };

      const existingUser = { id: 2, ...userData };
      mockUserRepository.findOneByWithPassword.mockResolvedValue(existingUser);

      const result = await authService.signUp(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is taken');
      expect(result.token).toBeUndefined();
      expect(result.user).toBeUndefined();

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should authenticate user successfully', async () => {
      const loginData = { username: 'testuser', password: 'password123' };
      const existingUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01'
      };
      const token = 'jwt-token-456';
      const formattedUser = { id: 1, username: 'testuser', first_name: 'John', last_name: 'Doe' };

      mockUserRepository.findOneByWithPassword.mockResolvedValue(existingUser);
      mockComparePassword.mockResolvedValue(true);
      mockGenerateToken.mockReturnValue(token);
      mockFormatUserResponse.mockReturnValue(formattedUser);

      const result = await authService.signIn(loginData);

      expect(result.success).toBe(true);
      expect(result.token).toBe(token);
      expect(result.user).toBe(formattedUser);

      expect(mockComparePassword).toHaveBeenCalledWith(loginData.password, existingUser.password);
    });

    it('should return error for invalid username', async () => {
      const loginData = { username: 'nonexistent', password: 'password123' };
      mockUserRepository.findOneByWithPassword.mockResolvedValue(undefined);

      const result = await authService.signIn(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should return error for wrong password', async () => {
      const loginData = { username: 'testuser', password: 'wrongpassword' };
      const existingUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01'
      };

      mockUserRepository.findOneByWithPassword.mockResolvedValue(existingUser);
      mockComparePassword.mockResolvedValue(false); // wrong password

      const result = await authService.signIn(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });
});