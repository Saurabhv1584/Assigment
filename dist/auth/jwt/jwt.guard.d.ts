import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "./jwt.service";
export declare class JwtGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): boolean;
}
