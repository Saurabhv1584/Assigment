export declare enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: UserRole[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
