export declare class Admin {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    static create(id: string, email: string, name: string): Admin;
    static reconstruct(id: string, email: string, name: string, isActive: boolean, createdAt: Date, updatedAt: Date): Admin;
}
