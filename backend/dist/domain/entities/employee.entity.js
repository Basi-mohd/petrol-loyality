"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
class Employee {
    constructor(id, employeeId, passwordHash, name, isActive, createdAt, updatedAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.passwordHash = passwordHash;
        this.name = name;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, employeeId, passwordHash, name) {
        const now = new Date();
        return new Employee(id, employeeId, passwordHash, name, true, now, now);
    }
    static reconstruct(id, employeeId, passwordHash, name, isActive, createdAt, updatedAt) {
        return new Employee(id, employeeId, passwordHash, name, isActive, createdAt, updatedAt);
    }
    deactivate() {
        return new Employee(this.id, this.employeeId, this.passwordHash, this.name, false, this.createdAt, new Date());
    }
    activate() {
        return new Employee(this.id, this.employeeId, this.passwordHash, this.name, true, this.createdAt, new Date());
    }
    updatePassword(passwordHash) {
        return new Employee(this.id, this.employeeId, passwordHash, this.name, this.isActive, this.createdAt, new Date());
    }
}
exports.Employee = Employee;
//# sourceMappingURL=employee.entity.js.map