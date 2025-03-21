import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { JwtService } from "./jwt/jwt.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<{ user: Partial<User>; token: string }> {
    const { email, password, firstName, lastName } = registerDto;
    try {
      // Check if email already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "Email already registered",
            data: { email },
          },
          HttpStatus.CONFLICT
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const user = await this.userService.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Generate JWT
      const token = this.jwtService.sign(user);

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user;

      return { user: userWithoutPassword, token };
    } catch (error) {
      Logger.log(`Error while registering user ${email}`);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        "Failed to register user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ user: Partial<User>; token: string }> {
    const { email, password } = loginDto;
    try {
      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "Invalid email",
            data: email,
          },
          HttpStatus.UNAUTHORIZED
        );
      }
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "Invalid password",
            data: null,
          },
          HttpStatus.UNAUTHORIZED
        );
      }
      // Generate JWT
      const token = this.jwtService.sign(user);

      const {
        password: _,
        createdAt,
        updatedAt,
        ...userWithoutPassword
      } = user;

      return { user: userWithoutPassword, token };
    } catch (error) {
      Logger.log(`Error while login user ${email}`);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "An unexpected error occurred during login",
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
