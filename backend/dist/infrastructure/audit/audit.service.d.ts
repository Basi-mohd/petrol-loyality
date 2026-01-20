import { AuditLog } from '../../domain/entities/audit-log.entity';
export declare class AuditService {
    private auditLogs;
    log(userId: string, userRole: string, action: string, resource: string, resourceId: string, details?: Record<string, any>, ipAddress?: string): Promise<void>;
    getLogs(userId?: string, resource?: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]>;
}
