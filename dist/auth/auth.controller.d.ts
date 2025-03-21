import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from 'src/user/dto/reponse.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<ResponseDto<{
        user: Partial<import("../user/entities/user.entity").User>;
        token: string;
    }>>;
    login(loginDto: LoginDto): Promise<ResponseDto<{
        user: Partial<import("../user/entities/user.entity").User>;
        token: string;
    }>>;
}
