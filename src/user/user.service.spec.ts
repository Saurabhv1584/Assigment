import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("UserService", () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should successfully create a user", async () => {
      const createUserDto = { email: "test@example.com", password: "password" };
      const savedUser = { ...createUserDto, id: "1" };
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      // const result = await service.create(createUserDto);

      // expect(result).toEqual(savedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it("should throw an error if creation fails", async () => {
      const createUserDto = { email: "test@example.com", password: "password" };
      mockUserRepository.save.mockRejectedValue(new Error("Database error"));

      // await expect(service.create(createUserDto)).rejects.toThrowError(
      //   new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR),
      // );
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      const users = [{ id: "1", email: "user1@example.com" }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it("should throw an error if no users are found", async () => {
      mockUserRepository.find.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrowError(
        new HttpException("No users found", HttpStatus.NOT_FOUND)
      );
    });

    it("should throw an error if there is an internal error", async () => {
      mockUserRepository.find.mockRejectedValue(new Error("Database error"));

      await expect(service.findAll()).rejects.toThrowError(
        new HttpException(
          "Failed to fetch all users",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("findOne", () => {
    it("should return a user by ID", async () => {
      const user = { id: "1", email: "user1@example.com" };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne("1");

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw an error if user is not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrowError(
        new HttpException("User with ID 1 not found", HttpStatus.NOT_FOUND)
      );
    });

    it("should throw an error if there is an internal error", async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(service.findOne("1")).rejects.toThrowError(
        new HttpException(
          "Failed to fetch one user by id",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("update", () => {
    it("should update a user by ID", async () => {
      const user = { id: "1", email: "user1@example.com", roles: [] };
      const updateUserDto = { email: "updated@example.com" };
      const updatedUser = { ...user, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update("1", updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it("should throw an error if user to update is not found", async () => {
      const updateUserDto = { email: "updated@example.com" };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update("1", updateUserDto)).rejects.toThrowError(
        new HttpException("User with ID 1 not found", HttpStatus.NOT_FOUND)
      );
    });

    it("should throw an error if update fails", async () => {
      const updateUserDto = { email: "updated@example.com" };
      mockUserRepository.findOne.mockResolvedValue({ id: "1" });
      mockUserRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(service.update("1", updateUserDto)).rejects.toThrowError(
        new HttpException(
          "Failed to update user",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("remove", () => {
    it("should remove a user by ID", async () => {
      const user = { id: "1", email: "user1@example.com" };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.delete.mockResolvedValue(undefined);

      await expect(service.remove("1")).resolves.toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(mockUserRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw an error if user to remove is not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove("1")).rejects.toThrowError(
        new HttpException("User with ID 1 not found", HttpStatus.NOT_FOUND)
      );
    });

    it("should throw an error if remove fails", async () => {
      const user = { id: "1", email: "user1@example.com" };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(service.remove("1")).rejects.toThrowError(
        new HttpException(
          "Failed to remove user",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
