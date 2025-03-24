import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ReponseUserDto } from "./dto/user-response.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const response = await this.userRepository.save(user);
      return response;
    } catch (error) {
      Logger.log(`Error creating user: ${error.message}`);
      throw new HttpException(
        "Failed to create user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<ReponseUserDto[]> {
    try {
      const userData = await this.userRepository.find();
      if (!userData) {
        throw new HttpException(`No users found`, HttpStatus.NOT_FOUND);
      }
      const sanitizedUserData = userData.map(({ password, ...user }) => ({
        ...user,
      }));

      return sanitizedUserData;
    } catch (error) {
      Logger.log(`findAll error ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        "Failed to fetch all users",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(id: string): Promise<ReponseUserDto> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      Logger.log(`findOne error ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        "Failed to fetch one user by id",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // auth
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
  
      if (!user) {
        throw new HttpException(
          `User with email ${email} not found`,
          HttpStatus.NOT_FOUND
        );
      }
  
      return user;
    } catch (error) {
      Logger.log("Error fetching user by email", error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Failed to fetch user by email",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ReponseUserDto> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      const updatedUser = Object.assign(user, updateUserDto);
      const isUpdatedUser = await this.userRepository.save(updatedUser);
      const { password: _, ...userWithoutPassword } = isUpdatedUser;
      return userWithoutPassword;
    } catch (error) {
      Logger.log(`update user by id error  ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        "Failed to update user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateRole(id: string, roles: UserRole[]): Promise<ReponseUserDto> {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
  
      const updatedRoles = Array.from(new Set([...user.roles, ...roles]));
      user.roles = updatedRoles;
  
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      Logger.log(`update user role by id error ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }
  
      throw new HttpException(
        "Failed to update user role",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  

  async remove(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          `User with ID ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
  
      await this.userRepository.delete(id);
    } catch (error) {
      Logger.log(`remove user by id error ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }
  
      throw new HttpException(
        "Failed to remove user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
}
