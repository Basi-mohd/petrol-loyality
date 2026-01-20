import { Injectable } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { HashUtils } from '../../shared/utils/hash.utils';

@Injectable()
export class AuditService {
  private auditLogs: AuditLog[] = [];

  async log(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any> = {},
    ipAddress?: string,
  ): Promise<void> {
    const id = HashUtils.generateId();
    const auditLog = AuditLog.create(
      id,
      userId,
      userRole,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
    );

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

  async getLogs(
    userId?: string,
    resource?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
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
}
