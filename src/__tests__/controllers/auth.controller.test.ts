import { Context } from "koa";
import { AuthController } from "../../controllers/authController";
import { AuthService } from "../../services/authService";
import { LoginData, User } from "../../models/userSchema";

jest.mock("../../services/authService");

describe("AuthContoller", () => {
  let authContoller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let ctx: Partial<Context>;

  beforeEach(() => {
    mockAuthService = new AuthService({} as any) as jest.Mocked<AuthService>;
    authContoller = new AuthController(mockAuthService);

    jest.clearAllMocks();

    ctx = {
      request: {
        body: {},
      } as any,
      state: {},
      status: undefined,
      body: undefined,
    };
  });

  describe("signUp", () => {
    it("should create user with 201", async () => {
      const userData: Omit<User, "id"> = {
        username: "newuser",
        password: "12345678",
        first_name: "John",
        last_name: "Doe",
        birth_date: "1990-01-01",
      };

      const serviceResp = {
        success: true,
        token: "token-123-jwt",
        user: {
          id: 1,
          username: "newuser",
          first_name: "John",
          last_name: "Doe",
        },
      };

      ctx.request!.body = userData;

      mockAuthService.signUp.mockResolvedValue(serviceResp);
      await authContoller.signUp(ctx as Context);

      expect(ctx.status).toBe(201);
      expect(ctx.body).toEqual({
        message: "User created successfully",
        token: serviceResp.token,
        user: serviceResp.user,
      });
    });
  });

  describe("signIn", () => {
    it("should log user in with 200", async () => {
      const loginData: LoginData = {
        username: "user1",
        password: "12345678",
      };

      const serviceResp = {
        success: true,
        token: "token-123-jwt",
        user: {
          id: 1,
          username: "user1",
          first_name: "John",
          last_name: "Doe",
        },
      };
      ctx.request!.body = loginData;
      mockAuthService.signIn.mockResolvedValue(serviceResp);
      await authContoller.signIn(ctx as Context);
      expect(ctx.status).toBe(200);
      console.log(ctx);
    });
  });
});
