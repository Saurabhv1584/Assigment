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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_entity_1 = require("./entities/user.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const reponse_dto_1 = require("./dto/reponse.dto");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll() {
        const users = await this.userService.findAll();
        return new reponse_dto_1.ResponseDto(common_1.HttpStatus.OK, 'Users fetched successfully', users);
    }
    async findOne(id) {
        const user = await this.userService.findOne(id);
        return new reponse_dto_1.ResponseDto(common_1.HttpStatus.OK, 'User fetched successfully', user);
    }
    async update(id, updateUserDto) {
        const user = await this.userService.update(id, updateUserDto);
        return new reponse_dto_1.ResponseDto(common_1.HttpStatus.OK, 'User deatil updated successfully', user);
    }
    async updateRole(id, updateRoleDto) {
        const user = await this.userService.updateRole(id, updateRoleDto.roles);
        return new reponse_dto_1.ResponseDto(common_1.HttpStatus.OK, 'User role updated successfully', user);
    }
    async remove(id) {
        await this.userService.remove(id);
        return new reponse_dto_1.ResponseDto(common_1.HttpStatus.OK, `User with ID ${id} deleted successfully`, null);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "GET all user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "successfully find all user",
        type: user_entity_1.User,
        isArray: true
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found"
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid data provided"
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.VIEWER),
    (0, swagger_1.ApiOperation)({ summary: "Find user by ID" }),
    (0, swagger_1.ApiOkResponse)({
        description: "successfully find user by ID",
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found"
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid data provided"
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.EDITOR),
    (0, swagger_1.ApiOperation)({ summary: "Update user by ID" }),
    (0, swagger_1.ApiOkResponse)({
        description: "successfully updated user by ID",
        type: update_user_dto_1.UpdateUserDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found"
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid data provided"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('role/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Add role to user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "successfully added role to user By ID",
        type: update_role_dto_1.UpdateRoleDto
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found"
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid data provided"
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Remove user" }),
    (0, swagger_1.ApiOkResponse)({
        description: "successfully deleted user by ID",
        type: null
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "User not found"
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "Invalid data provided"
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map