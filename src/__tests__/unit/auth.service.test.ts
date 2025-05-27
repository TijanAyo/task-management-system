import { AuthService } from "../../services/auth.service";
import { User, Role } from "../../models";
import { AppError, AppResponse } from "../../helpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  Role: {
    findOne: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    process.env.SALT_ROUND = "10";
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "24h";

    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("register", () => {
    const mockRegisterPayload = {
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const mockDefaultRole = {
      id: 1,
      title: "user",
    };

    it("should register a new user successfully", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      (Role.findOne as jest.Mock).mockResolvedValue(mockDefaultRole);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      (User.create as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await authService.register(mockRegisterPayload);

      expect(result).toEqual(AppResponse("User created successfully"));
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          email: mockRegisterPayload.email.toLowerCase(),
          deletedFlag: false,
        },
      });
      expect(User.create).toHaveBeenCalledWith({
        email: mockRegisterPayload.email.toLowerCase(),
        password: "hashedPassword",
        roleId: mockDefaultRole.id,
      });
    });

    it("should throw error if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(authService.register(mockRegisterPayload)).rejects.toThrow(
        AppError.badRequest("User already exists")
      );
    });
  });

  describe("login", () => {
    const mockLoginPayload = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };

    it("should login user successfully", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      const result = await authService.login(mockLoginPayload);

      expect(result).toEqual(
        AppResponse("login successful", { accessToken: "mockToken" })
      );
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          email: mockLoginPayload.email,
          deletedFlag: false,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginPayload.password,
        mockUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
      );
    });

    it("should throw error if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginPayload)).rejects.toThrow(
        AppError.notFound("Invalid email or password provided")
      );
    });

    it("should throw error if password does not match", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginPayload)).rejects.toThrow(
        AppError.badRequest("Invalid email or passoword provided")
      );
    });
  });

  describe("private methods", () => {
    describe("hashPayload", () => {
      it("should hash payload correctly", async () => {
        const payload = "testPassword";
        const hashedPassword = "hashedPassword";

        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

        const result = await (authService as any).hashPayload(payload);

        expect(result).toBe(hashedPassword);
        expect(bcrypt.hash).toHaveBeenCalledWith(
          payload,
          Number(process.env.SALT_ROUND)
        );
      });
    });

    describe("compareHash", () => {
      it("should compare hash correctly", async () => {
        const payload = "testPassword";
        const hashedPayload = "hashedPassword";

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await (authService as any).compareHash(
          payload,
          hashedPayload
        );

        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith(payload, hashedPayload);
      });
    });

    describe("generateAccessToken", () => {
      it("should generate access token correctly", () => {
        const userId = 1;
        const mockToken = "mockToken";

        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        const result = (authService as any).generateAccessToken(userId);

        expect(result).toBe(mockToken);
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId },
          process.env.JWT_SECRET,
          { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
        );
      });
    });
  });
});
