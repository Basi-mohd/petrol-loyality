export class AuditLog {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly userRole: string,
    public readonly action: string,
    public readonly resource: string,
    public readonly resourceId: string,
    public readonly details: Record<string, any>,
    public readonly timestamp: Date,
    public readonly ipAddress?: string,
  ) {}

  static create(
    id: string,
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any> = {},
    ipAddress?: string,
  ): AuditLog {
    return new AuditLog(
      id,
      userId,
      userRole,
      action,
      resource,
      resourceId,
      details,
      new Date(),
      ipAddress,
    );
  }

  static reconstruct(
    id: string,
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any>,
    timestamp: Date,
    ipAddress?: string,
  ): AuditLog {
    return new AuditLog(
      id,
      userId,
      userRole,
      action,
      resource,
      resourceId,
      details,
      timestamp,
      ipAddress,
    );
  }
}
