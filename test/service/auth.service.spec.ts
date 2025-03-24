import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { JwtService } from "./jwt/jwt.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRole } from "../../src/user/entities/user.entity";

describe("AuthService", () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe("register", () => {
    const createUser = {
        email: "teasdasdast@gmail.com",
        firstName: "test",
        lastName: "111",
        password: 'asdfghjk',
        id: "6304330d-491b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    const result = {
      user: {
        email: "teasdasdast@gmail.com",
        firstName: "test",
        lastName: "111",
        id: "6304330d-491b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token:
        "token",
    };
    it("should register a new user", async () => {
      const registerDto: RegisterDto = {
        email: "teasdasdast@example.com",
        password: "password",
        firstName: "John",
        lastName: "Doe",
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
      jest.spyOn(userService, "create").mockResolvedValue(createUser);
      jest.spyOn(jwtService, "sign").mockReturnValue("token");

      const response = await authService.register(registerDto);

      expect(response).toEqual(result);
    });

    it("should throw an error if email already exists", async () => {
      const registerDto: RegisterDto = {
        email: "test@example.com",
        password: "password",
        firstName: "John",
        lastName: "Doe",
      };

      const existingUser = {
        id: "3405d58f-f470-404a-9ef7-00b908750383",
        email: "test@gmail.com",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "123",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "Email already registered",
            data: { email: "test@gmail.com" },
          },
          HttpStatus.CONFLICT
        )
      );
    });
  });

  describe("login", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should login a user", async () => {
      const loginDto: LoginDto = {
        email: "test1584@example.com",
        password: "password",
      };

      const existingUser = {
        id: "3405d58f-f470-404a-9ef7-00b908750383",
        email: "test1584@gmail.com",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "123",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = {
        user: {
          email: "test1584@gmail.com",
          firstName: "Test",
          lastName: "123",
          id: "3405d58f-f470-404a-9ef7-00b908750383",
          roles: [UserRole.VIEWER],
          isActive: true,
        },
        token:
          "token",
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(existingUser);
      Object.defineProperty(bcrypt, "compare", {
        value: jest.fn().mockResolvedValue(true),
      });
      jest.spyOn(jwtService, "sign").mockReturnValue("token");

      const response = await authService.login(loginDto);

      expect(response).toEqual(result);
    });

    it("should throw an error if user is not found", async () => {
      const loginDto: LoginDto = {
        email: "test123@example.com",
        password: "password",
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "Invalid email",
            data: "invalid@example.com",
          },
          HttpStatus.UNAUTHORIZED
        )
      );
    });

    it("should throw an error if password is invalid", async () => {
      const loginDto: LoginDto = {
        email: "test1584@example.com",
        password: "test",
      };

      const existingUser = {
        id: "3405d58f-f470-404a-9ef7-00b908750383",
        email: "test1584@gmail.com",
        password: "hashedpassword",
        firstName: "Test",
        lastName: "123",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, "findByEmail").mockResolvedValue(existingUser);
      Object.defineProperty(bcrypt, "compare", {
        value: jest.fn().mockResolvedValue(false),
      });

      await expect(authService.login(loginDto)).rejects.toThrow(
        new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "Invalid password",
            data: null,
          },
          HttpStatus.UNAUTHORIZED
        )
      );
    });
  });
  
});
