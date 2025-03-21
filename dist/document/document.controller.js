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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const document_service_1 = require("./document.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
const user_entity_1 = require("../user/entities/user.entity");
const roles_guard_1 = require("../auth/roles/roles.guard");
let DocumentController = class DocumentController {
    constructor(documentService) {
        this.documentService = documentService;
    }
    async uploadFile(file, title, req) {
        var _a;
        common_1.Logger.log("Received request to upload file " + file);
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        return this.documentService.uploadFile(file, title, userId);
    }
    async listFiles() {
        common_1.Logger.log("Listing content of bucket ");
        return this.documentService.listFiles();
    }
    async getFile(id) {
        common_1.Logger.log("Get file from s3 bucket with id " + id);
        return this.documentService.getFile(id);
    }
    async deleteFile(id) {
        common_1.Logger.log("Deleting file from s3 bucket with id " + id);
        await this.documentService.deleteFile(id);
        return { message: "File deleted successfully" };
    }
};
exports.DocumentController = DocumentController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.EDITOR),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("title")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)("list"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.VIEWER, user_entity_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getFile", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteFile", null);
exports.DocumentController = DocumentController = __decorate([
    (0, common_1.Controller)("files"),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map