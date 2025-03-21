"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const common_1 = require("@nestjs/common");
describe("UserService", () => {
    let service;
    let userRepository;
    const mockUserRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                user_service_1.UserService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();
        service = module.get(user_service_1.UserService);
        userRepository = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
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
            const savedUser = Object.assign(Object.assign({}, createUserDto), { id: "1" });
            mockUserRepository.create.mockReturnValue(savedUser);
            mockUserRepository.save.mockResolvedValue(savedUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
            expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
        });
        it("should throw an error if creation fails", async () => {
            const createUserDto = { email: "test@example.com", password: "password" };
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));
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
            await expect(service.findAll()).rejects.toThrowError(new common_1.HttpException("No users found", common_1.HttpStatus.NOT_FOUND));
        });
        it("should throw an error if there is an internal error", async () => {
            mockUserRepository.find.mockRejectedValue(new Error("Database error"));
            await expect(service.findAll()).rejects.toThrowError(new common_1.HttpException("Failed to fetch all users", common_1.HttpStatus.INTERNAL_SERVER_ERROR));
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
            await expect(service.findOne("1")).rejects.toThrowError(new common_1.HttpException("User with ID 1 not found", common_1.HttpStatus.NOT_FOUND));
        });
        it("should throw an error if there is an internal error", async () => {
            mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));
            await expect(service.findOne("1")).rejects.toThrowError(new common_1.HttpException("Failed to fetch one user by id", common_1.HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });
    describe("update", () => {
        it("should update a user by ID", async () => {
            const user = { id: "1", email: "user1@example.com", roles: [] };
            const updateUserDto = { email: "updated@example.com" };
            const updatedUser = Object.assign(Object.assign({}, user), updateUserDto);
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
            await expect(service.update("1", updateUserDto)).rejects.toThrowError(new common_1.HttpException("User with ID 1 not found", common_1.HttpStatus.NOT_FOUND));
        });
        it("should throw an error if update fails", async () => {
            const updateUserDto = { email: "updated@example.com" };
            mockUserRepository.findOne.mockResolvedValue({ id: "1" });
            mockUserRepository.save.mockRejectedValue(new Error("Database error"));
            await expect(service.update("1", updateUserDto)).rejects.toThrowError(new common_1.HttpException("Failed to update user", common_1.HttpStatus.INTERNAL_SERVER_ERROR));
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
            await expect(service.remove("1")).rejects.toThrowError(new common_1.HttpException("User with ID 1 not found", common_1.HttpStatus.NOT_FOUND));
        });
        it("should throw an error if remove fails", async () => {
            const user = { id: "1", email: "user1@example.com" };
            mockUserRepository.findOne.mockResolvedValue(user);
            mockUserRepository.delete.mockRejectedValue(new Error("Database error"));
            await expect(service.remove("1")).rejects.toThrowError(new common_1.HttpException("Failed to remove user", common_1.HttpStatus.INTERNAL_SERVER_ERROR));
        });
    });
});
//# sourceMappingURL=user.service.spec.js.map