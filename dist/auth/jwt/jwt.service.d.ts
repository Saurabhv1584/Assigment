import { ConfigService } from "@nestjs/config";
import { User } from "../../user/entities/user.entity";
export declare class JwtService {
    private configService;
    constructor(configService: ConfigService);
    sign(user: User): string;
    verifyToken(token: string): any;
}
