"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const audit_log_entity_1 = require("../../domain/entities/audit-log.entity");
const hash_utils_1 = require("../../shared/utils/hash.utils");
let AuditService = class AuditService {
    constructor() {
        this.auditLogs = [];
    }
    async log(userId, userRole, action, resource, resourceId, details = {}, ipAddress) {
        const id = hash_utils_1.HashUtils.generateId();
        const auditLog = audit_log_entity_1.AuditLog.create(id, userId, userRole, action, resource, resourceId, details, ipAddress);
        this.auditLogs.push(auditLog);
        console.log('[AUDIT]', {
            id: auditLog.id,
            userId: auditLog.userId,
            userRole: auditLog.userRole,
            action: auditLog.action,
            resource: auditLog.resource,
            resourceId: auditLog.resourceId,
            timestamp: auditLog.timestamp,
        });
    }
    async getLogs(userId, resource, startDate, endDate) {
        let logs = [...this.auditLogs];
        if (userId) {
            logs = logs.filter((log) => log.userId === userId);
        }
        if (resource) {
            logs = logs.filter((log) => log.resource === resource);
        }
        if (startDate) {
            logs = logs.filter((log) => log.timestamp >= startDate);
        }
        if (endDate) {
            logs = logs.filter((log) => log.timestamp <= endDate);
        }
        return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)()
], AuditService);
//# sourceMappingURL=audit.service.js.map