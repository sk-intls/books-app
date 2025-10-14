import { UserRepository } from "../repository/userRepository";
import { User, LoginData } from "../models/userSchema";
import {
  hashPassword,
  comparePassword,
  generateToken,
  formatUserResponse,
} from "../utils/auth";

interface AuthResult {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(userData: Omit<User, "id">): Promise<AuthResult> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        username: userData.username,
      });

      if (existingUser) {
        return { success: false, error: "Username is taken" };
      }

      const hashedPassword = await hashPassword(userData.password);
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      const token = generateToken({
        id: newUser.id!,
        username: newUser.username,
      });

      return {
        success: true,
        token,
        user: formatUserResponse(newUser),
      };
    } catch (error) {
      return { success: false, error: "Failed to create user" };
    }
  }

  async signIn(loginData: LoginData): Promise<AuthResult> {
    try {
      const user = await this.userRepository.findOneBy({
        username: loginData.username,
      });

      if (!user) {
        return { success: false, error: "Invalid credentials" };
      }

      const isPasswordValid = await comparePassword(
        loginData.password,
        user.password
      );
      if (!isPasswordValid) {
        return { success: false, error: "Invalid credentials" };
      }

      const token = generateToken({
        id: user.id!,
        username: user.username,
      });

      return {
        success: true,
        token,
        user: formatUserResponse(user),
      };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  }
}
