import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseDto } from './dto/reponse.dto';
import { ReponseUserDto } from './dto/user-response.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<ResponseDto<Partial<User>[]>>;
    findOne(id: string): Promise<ResponseDto<Partial<User>>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<ReponseUserDto>>;
    updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<ResponseDto<ReponseUserDto>>;
    remove(id: string): Promise<ResponseDto<null>>;
}
