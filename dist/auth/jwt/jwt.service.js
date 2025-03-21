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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
var jwt = require("jsonwebtoken");
let JwtService = class JwtService {
    constructor(configService) {
        this.configService = configService;
    }
    sign(user) {
        const payload = {
            id: user.id,
            email: user.email,
            roles: user.roles,
        };
        const secret = this.configService.get("JWT_SECRET");
        const expiresIn = this.configService.get("JWT_EXPIRATION");
        const token = jwt.sign(payload, secret, { expiresIn });
        return token;
    }
    verifyToken(token) {
        try {
            const secret = this.configService.get("JWT_SECRET");
            const decoded = jwt.verify(token, secret);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map