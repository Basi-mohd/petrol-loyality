export declare class Employee {
    readonly id: string;
    readonly employeeId: string;
    readonly passwordHash: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    static create(id: string, employeeId: string, passwordHash: string, name: string): Employee;
    static reconstruct(id: string, employeeId: string, passwordHash: string, name: string, isActive: boolean, createdAt: Date, updatedAt: Date): Employee;
    deactivate(): Employee;
    activate(): Employee;
    updatePassword(passwordHash: string): Employee;
}
