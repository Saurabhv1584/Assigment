import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ReponseUserDto } from "./dto/user-response.dto";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<ReponseUserDto[]>;
    findOne(id: string): Promise<ReponseUserDto>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<ReponseUserDto>;
    updateRole(id: string, roles: UserRole[]): Promise<ReponseUserDto>;
    remove(id: string): Promise<void>;
}
