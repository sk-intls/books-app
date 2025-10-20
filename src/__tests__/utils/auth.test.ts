import {
  comparePassword,
  formatUserResponse,
  generateToken,
  hashPassword,
} from "../../utils/auth";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  username: string;
}
describe("Password utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const plainPassword = "password123";
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword).toBeTruthy();
    });

    it("should create diff hash for same password", async () => {
      const p1 = "password1";
      const p2 = "password2";
      const hashed1 = await hashPassword(p1);
      const hashed2 = await hashPassword(p2);

      expect(hashed1).not.toBe(hashed2);
    });
  });
  describe("comparePassword", () => {
    it("should return true for correct passw", async () => {
      const plainPassword = "pass123";
      const hashed = await hashPassword(plainPassword);
      const isValid = await comparePassword(plainPassword, hashed);

      expect(isValid).toBe(true);
    });

    it("should return false for incorrect passw", async () => {
      const correctPassword = "pass123";
      const incorrectPass = "pass12";
      const correctPassHashed = await hashPassword(correctPassword);
      const isValid = await comparePassword(correctPassHashed, incorrectPass);

      expect(isValid).toBe(false);
    });
  });

  describe("generateToken", () => {
    beforeAll(() => {
      process.env.JWT_SECRET = "secret-jwt-key";
    });
    it("should create jwt token", () => {
      const payload = { id: 1, username: "John Doe" };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      expect(decoded.id).toBe(payload.id);
      expect(decoded.username).toBe(payload.username);
    });
  });

  describe("formatUserResponce", () => {
    it("should format data correctly", () => {
      const user = {
        id: 1,
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        password: "shouldNotAppearInResponse",
        birth_date: "1990-01-01",
      };

      const formatted = formatUserResponse(user);

      expect(formatted).toEqual({
        id: 1,
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
      });
      expect(formatted).not.toHaveProperty("password");
      expect(formatted).not.toHaveProperty("birth_date");
    });
  });
});
