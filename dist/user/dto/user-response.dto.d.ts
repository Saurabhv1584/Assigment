import { UserRole } from '../entities/user.entity';
export declare class ReponseUserDto {
    email: string;
    firstName: string;
    lastName: string;
    roles?: UserRole[];
}
