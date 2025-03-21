"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const jwt_service_1 = require("./jwt/jwt.service");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../src/user/entities/user.entity");
describe("AuthService", () => {
    let authService;
    let userService;
    let jwtService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: user_service_1.UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: jwt_service_1.JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();
        authService = module.get(auth_service_1.AuthService);
        userService = module.get(user_service_1.UserService);
        jwtService = module.get(jwt_service_1.JwtService);
    });
    describe("register", () => {
        const createUser = {
            email: "teasdasdast@gmail.com",
            firstName: "test",
            lastName: "111",
            password: 'asdfghjk',
            id: "6304330d-491b-4185-8d61-359aa6868e1e",
            roles: [user_entity_1.UserRole.VIEWER],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = {
            user: {
                email: "teasdasdast@gmail.com",
                firstName: "test",
                lastName: "111",
                id: "6304330d-491b-4185-8d61-359aa6868e1e",
                roles: [user_entity_1.UserRole.VIEWER],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            token: "token",
        };
        it("should register a new user", async () => {
            const registerDto = {
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
            const registerDto = {
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
                roles: [user_entity_1.UserRole.VIEWER],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(userService, "findByEmail").mockResolvedValue(existingUser);
            await expect(authService.register(registerDto)).rejects.toThrow(new common_1.HttpException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: "Email already registered",
                data: { email: "test@gmail.com" },
            }, common_1.HttpStatus.CONFLICT));
        });
    });
    describe("login", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it("should login a user", async () => {
            const loginDto = {
                email: "test1584@example.com",
                password: "password",
            };
            const existingUser = {
                id: "3405d58f-f470-404a-9ef7-00b908750383",
                email: "test1584@gmail.com",
                password: "hashedpassword",
                firstName: "Test",
                lastName: "123",
                roles: [user_entity_1.UserRole.VIEWER],
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
                    roles: [user_entity_1.UserRole.VIEWER],
                    isActive: true,
                },
                token: "token",
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
            const loginDto = {
                email: "test123@example.com",
                password: "password",
            };
            jest.spyOn(userService, "findByEmail").mockResolvedValue(null);
            await expect(authService.login(loginDto)).rejects.toThrow(new common_1.HttpException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: "Invalid email",
                data: "invalid@example.com",
            }, common_1.HttpStatus.UNAUTHORIZED));
        });
        it("should throw an error if password is invalid", async () => {
            const loginDto = {
                email: "test1584@example.com",
                password: "test",
            };
            const existingUser = {
                id: "3405d58f-f470-404a-9ef7-00b908750383",
                email: "test1584@gmail.com",
                password: "hashedpassword",
                firstName: "Test",
                lastName: "123",
                roles: [user_entity_1.UserRole.VIEWER],
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(userService, "findByEmail").mockResolvedValue(existingUser);
            Object.defineProperty(bcrypt, "compare", {
                value: jest.fn().mockResolvedValue(false),
            });
            await expect(authService.login(loginDto)).rejects.toThrow(new common_1.HttpException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: "Invalid password",
                data: null,
            }, common_1.HttpStatus.UNAUTHORIZED));
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map