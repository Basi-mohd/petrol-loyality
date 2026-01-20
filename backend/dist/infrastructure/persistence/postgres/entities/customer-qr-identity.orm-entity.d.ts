export declare class CustomerQrIdentityOrmEntity {
    id: string;
    customerId: string;
    qrToken: string;
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date | null;
}
