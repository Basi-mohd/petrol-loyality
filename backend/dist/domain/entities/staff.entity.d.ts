import { UserRole } from '../enums/user-role.enum';
export declare class Staff {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly role: UserRole;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    static create(id: string, email: string, name: string, role?: UserRole): Staff;
    static reconstruct(id: string, email: string, name: string, role: UserRole, isActive: boolean, createdAt: Date, updatedAt: Date): Staff;
    deactivate(): Staff;
    activate(): Staff;
}
