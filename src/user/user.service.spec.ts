import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User, UserRole } from "./entities/user.entity";
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
    const createUser = {
      email: "teasdasdast@gmail.com",
      firstName: "test",
      lastName: "111",
      password: "asdfghjk",
      id: "6304330d-491b-4185-8d61-359aa6868e1e",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it("should successfully create a user", async () => {
      mockUserRepository.create.mockReturnValue(createUser);
      mockUserRepository.save.mockResolvedValue(createUser);

      const result = await service.create(createUser);

      expect(result).toEqual(createUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUser);
    });

    it("should throw an error if creation fails", async () => {
      mockUserRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(service.create(createUser)).rejects.toThrowError(
        new HttpException(
          "Failed to create user",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("findAll", () => {
    const result = [
      {
        email: "teasdasdast@gmail.com",
        firstName: "test",
        lastName: "111",
        id: "6304330d-491b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "test123@gmail.com",
        firstName: "test123",
        lastName: "123",
        id: "6304330d-486b-4185-8d61-359aa6868e1e",
        roles: [UserRole.VIEWER],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    it("should return all users", async () => {
      mockUserRepository.find.mockResolvedValue(result);

      const response = await service.findAll();

      expect(response).toEqual(result);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it("should throw an error if no users are found", async () => {
      mockUserRepository.find.mockResolvedValue(null);

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
    const createUser = {
      email: "teasdasdast@gmail.com",
      firstName: "test",
      lastName: "111",
      id: "6304330d-491b-4185-8d61-359aa6868e1e",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it("should return a user by ID", async () => {
      mockUserRepository.findOne.mockResolvedValue(createUser);

      const result = await service.findOne(
        "6304330d-491b-4185-8d61-359aa6868e1e"
      );

      expect(result).toEqual(createUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "6304330d-491b-4185-8d61-359aa6868e1e" },
      });
    });

    it("should throw an error if user is not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne("6304330d-491b-4185-8d61-359aa6868e10")
      ).rejects.toThrowError(
        new HttpException(
          "User with ID 6304330d-491b-4185-8d61-359aa6868e10 not found",
          HttpStatus.NOT_FOUND
        )
      );
    });

    it("should throw an error if there is an internal error", async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(service.findOne("1asasa")).rejects.toThrowError(
        new HttpException(
          "Failed to fetch one user by id",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("findByEmail", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const createUser = {
      email: "teasdasdast@gmail.com",
      firstName: "test",
      lastName: "111",
      id: "6304330d-491b-4185-8d61-359aa6868e1e",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it("should return a user by email", async () => {
      const email = "saurabh12@gmail.com";
      mockUserRepository.findOne.mockResolvedValue(createUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(createUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it("should throw an error if user is not found", async () => {
      const email = 'sau2@gmail.com'
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail(email)).rejects.toThrowError(
        new HttpException(
          "User with email sau2@gmail.com not found",
          HttpStatus.NOT_FOUND
        )
      );
    });

    it("should throw an error if there is an internal error", async () => {
      const email = 'sabh12@gmail.com'
      mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

      await expect(service.findByEmail(email)).rejects.toThrowError(
        new HttpException(
          "Failed to fetch user by email",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("update", () => {
    const createUser = {
      email: "teasdasdast@gmail.com",
      firstName: "test",
      lastName: "111",
      id: "6304330d-491b-4185-8d61-359aa6868e1e",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newUser = {
      email: "teasdasdast@gmail.com",
      firstName: "test",
      lastName: "new",
      id: "6304330d-491b-4185-8d61-359aa6868e1e",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it("should update a user by ID", async () => {
      const updateUserDto = { lastName: "new" };
      const updatedUser = { ...createUser, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(createUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const respose = await service.update(
        "6304330d-491b-4185-8d61-359aa6868e1e",
        updateUserDto
      );

      expect(respose).toEqual(newUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "6304330d-491b-4185-8d61-359aa6868e1e" },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it("should throw an error if user to update is not found", async () => {
      const updateUserDto = { email: "updated@example.com" };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update("6304330d-491b-4185-8d61-359aa6868e10", updateUserDto)
      ).rejects.toThrowError(
        new HttpException(
          "User with ID 6304330d-491b-4185-8d61-359aa6868e10 not found",
          HttpStatus.NOT_FOUND
        )
      );
    });

    it("should throw an error if update fails", async () => {
      const updateUserDto = { email: "updated@example.com" };
      mockUserRepository.findOne.mockResolvedValue({
        id: "6304330d-491b-4185-8d61-359aa6868e1e0",
      });
      mockUserRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(
        service.update("6304330d-491b-4185-8d61-359aa6868e1e0", updateUserDto)
      ).rejects.toThrowError(
        new HttpException(
          "Failed to update user",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe("updateRole", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const id = "6304330d-491b-4185-8d61-359aa6868e1e";
    const roles = [UserRole.ADMIN, UserRole.VIEWER];
    const existingUser = {
      id,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      roles: [UserRole.VIEWER],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedUser = {
      ...existingUser,
      roles: [UserRole.VIEWER, UserRole.ADMIN], // Merged roles
    };

    it("should successfully update user roles", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateRole(id, roles);

      expect(result).toEqual(updatedUser);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it("should throw an error if user is not found", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(null);

      await expect(service.updateRole(id, roles)).rejects.toThrowError(
        new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND)
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it("should throw an internal server error if update fails", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(existingUser);
      mockUserRepository.save.mockRejectedValue(new Error("Database error"));

      await expect(service.updateRole(id, roles)).rejects.toThrowError(
        new HttpException(
          "Failed to update user role",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe("remove", () => {
    it("should remove a user by ID", async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: "6304330d-491b-4185-8d61-359aa6868e1e0",
      });
      mockUserRepository.delete.mockResolvedValue(undefined);

      await expect(
        service.remove("6304330d-491b-4185-8d61-359aa6868e1e0")
      ).resolves.toBeUndefined();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "6304330d-491b-4185-8d61-359aa6868e1e0" },
      });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(
        "6304330d-491b-4185-8d61-359aa6868e1e0"
      );
    });

    it("should throw an error if user to remove is not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove("6304330d-491b-4185-8d61-359aa6868e10")
      ).rejects.toThrowError(
        new HttpException(
          "User with ID 6304330d-491b-4185-8d61-359aa6868e10 not found",
          HttpStatus.NOT_FOUND
        )
      );
    });

    it("should throw an error if remove fails", async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: "6304330d-491b-4185-8d61-359aa6868e1e0",
      });
      mockUserRepository.delete.mockRejectedValue(new Error("Database error"));

      await expect(
        service.remove("6304330d-491b-4185-8d61-359aa6868e1e0")
      ).rejects.toThrowError(
        new HttpException(
          "Failed to remove user",
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
