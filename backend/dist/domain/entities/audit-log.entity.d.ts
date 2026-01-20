export declare class AuditLog {
    readonly id: string;
    readonly userId: string;
    readonly userRole: string;
    readonly action: string;
    readonly resource: string;
    readonly resourceId: string;
    readonly details: Record<string, any>;
    readonly timestamp: Date;
    readonly ipAddress?: string;
    private constructor();
    static create(id: string, userId: string, userRole: string, action: string, resource: string, resourceId: string, details?: Record<string, any>, ipAddress?: string): AuditLog;
    static reconstruct(id: string, userId: string, userRole: string, action: string, resource: string, resourceId: string, details: Record<string, any>, timestamp: Date, ipAddress?: string): AuditLog;
}
