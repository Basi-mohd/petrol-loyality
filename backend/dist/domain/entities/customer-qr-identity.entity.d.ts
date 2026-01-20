export declare class CustomerQrIdentity {
    readonly id: string;
    readonly customerId: string;
    readonly qrToken: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly expiresAt: Date | null;
    private constructor();
    static create(id: string, customerId: string, qrToken: string, expiresAt?: Date | null): CustomerQrIdentity;
    static reconstruct(id: string, customerId: string, qrToken: string, isActive: boolean, createdAt: Date, expiresAt: Date | null): CustomerQrIdentity;
    deactivate(): CustomerQrIdentity;
    isExpired(): boolean;
}
