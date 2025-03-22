import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';
import { ResponseDto } from '../user/dto/reponse.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../user/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
      const registerDto: RegisterDto = {
        firstName: 'john',
        lastName: 'doe',
        email: 'johndoe@gmail.com',
        password: 'password123',
      };
    it('should register a new user and return success response', async () => {

      const response = {
        user: {
          email: "johndoe@gmail.com",
          firstName: "john",
          lastName: "doe",
          id: "6304330d-491b-4185-8d61-359aa6868e1e",
          roles: [UserRole.VIEWER],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token:
          "token",
      };

    //   const response = { id: '12345', username: 'john_doe', email: 'john@example.com' };

      jest.spyOn(authService, 'register').mockResolvedValue(response);

      const result = await authController.register(registerDto);

      expect(result).toEqual(
        new ResponseDto(HttpStatus.OK, 'Users Created successfully', response),
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error if registration fails', async () => {
      jest.spyOn(authService, 'register').mockRejectedValue(new Error('Registration failed'));

      try {
        await authController.register(registerDto);
      } catch (error) {
        expect(error.message).toBe('Registration failed');
      }
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
      const loginDto: LoginDto = {
        email: 'johndoe@gmail.com',
        password: 'password123',
      };
    it('should login the user and return success response', async () => {

      const response = {
        user: {
          email: "johndoe@gmail.com",
          firstName: "john",
          lastName: "doe",
          id: "3405d58f-f470-404a-9ef7-00b908750383",
          roles: [UserRole.VIEWER],
          isActive: true,
        },
        token:
          "token",
      };

      jest.spyOn(authService, 'login').mockResolvedValue(response);

      const result = await authController.login(loginDto);

      expect(result).toEqual(
        new ResponseDto(HttpStatus.OK, 'Users Logged in successfully', response),
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw an error if login fails', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));

      try {
        await authController.login(loginDto);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
