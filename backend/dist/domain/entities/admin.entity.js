"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
class Admin {
    constructor(id, email, name, isActive, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, email, name) {
        const now = new Date();
        return new Admin(id, email, name, true, now, now);
    }
    static reconstruct(id, email, name, isActive, createdAt, updatedAt) {
        return new Admin(id, email, name, isActive, createdAt, updatedAt);
    }
}
exports.Admin = Admin;
//# sourceMappingURL=admin.entity.js.map