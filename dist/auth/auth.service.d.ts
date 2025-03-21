import { UserService } from "../user/user.service";
import { JwtService } from "./jwt/jwt.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "../user/entities/user.entity";
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Partial<User>;
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        token: string;
    }>;
}
