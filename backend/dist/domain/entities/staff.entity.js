"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const user_role_enum_1 = require("../enums/user-role.enum");
class Staff {
    constructor(id, email, name, role, isActive, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(id, email, name, role = user_role_enum_1.UserRole.STAFF) {
        const now = new Date();
        return new Staff(id, email, name, role, true, now, now);
    }
    static reconstruct(id, email, name, role, isActive, createdAt, updatedAt) {
        return new Staff(id, email, name, role, isActive, createdAt, updatedAt);
    }
    deactivate() {
        return new Staff(this.id, this.email, this.name, this.role, false, this.createdAt, new Date());
    }
    activate() {
        return new Staff(this.id, this.email, this.name, this.role, true, this.createdAt, new Date());
    }
}
exports.Staff = Staff;
//# sourceMappingURL=staff.entity.js.map