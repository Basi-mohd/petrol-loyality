"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
class AuditLog {
    constructor(id, userId, userRole, action, resource, resourceId, details, timestamp, ipAddress) {
        this.id = id;
        this.userId = userId;
        this.userRole = userRole;
        this.action = action;
        this.resource = resource;
        this.resourceId = resourceId;
        this.details = details;
        this.timestamp = timestamp;
        this.ipAddress = ipAddress;
    }
    static create(id, userId, userRole, action, resource, resourceId, details = {}, ipAddress) {
        return new AuditLog(id, userId, userRole, action, resource, resourceId, details, new Date(), ipAddress);
    }
    static reconstruct(id, userId, userRole, action, resource, resourceId, details, timestamp, ipAddress) {
        return new AuditLog(id, userId, userRole, action, resource, resourceId, details, timestamp, ipAddress);
    }
}
exports.AuditLog = AuditLog;
//# sourceMappingURL=audit-log.entity.js.map