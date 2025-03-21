"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        try {
            const user = this.userRepository.create(createUserDto);
            return await this.userRepository.save(user);
        }
        catch (error) {
            common_1.Logger.log(`Error creating user: ${error.message}`);
            throw new common_1.HttpException("Failed to create user", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findAll() {
        try {
            const userData = await this.userRepository.find();
            if (!userData) {
                throw new common_1.HttpException(`No users found`, common_1.HttpStatus.NOT_FOUND);
            }
            const sanitizedUserData = userData.map((_a) => {
                var { password } = _a, user = __rest(_a, ["password"]);
                return (Object.assign({}, user));
            });
            return sanitizedUserData;
        }
        catch (error) {
            common_1.Logger.log(`findAll error ${error}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to fetch all users", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.HttpException(`User with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        }
        catch (error) {
            common_1.Logger.log(`findOne error ${error}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to fetch one user by id", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            return user;
        }
        catch (error) {
            common_1.Logger.log("findByEmail error", error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to fetch user by email", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateUserDto) {
        try {
            const user = await this.findOne(id);
            if (!user) {
                throw new common_1.HttpException(`User with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            const updatedUser = Object.assign(user, updateUserDto);
            const isUpdatedUser = await this.userRepository.save(updatedUser);
            const { password: _ } = isUpdatedUser, userWithoutPassword = __rest(isUpdatedUser, ["password"]);
            return userWithoutPassword;
        }
        catch (error) {
            common_1.Logger.log(`update user by id error  ${error}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to update user", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(id, roles) {
        try {
            const user = await this.findOne(id);
            if (!user) {
                throw new common_1.HttpException(`User with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            const updatedRoles = Array.from(new Set([...user.roles, ...roles]));
            user.roles = updatedRoles;
            const updatedUser = await this.userRepository.save(user);
            return updatedUser;
        }
        catch (error) {
            common_1.Logger.log(`update user role by id error ${error}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to update user role", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user) {
                throw new common_1.HttpException(`User with ID ${id} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            await this.userRepository.delete(id);
        }
        catch (error) {
            common_1.Logger.log(`remove user by id error ${error}`);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException("Failed to remove user", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map