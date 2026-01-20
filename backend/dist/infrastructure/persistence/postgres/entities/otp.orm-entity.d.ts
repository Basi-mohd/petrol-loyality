export declare class OtpOrmEntity {
    id: string;
    phoneNumber: string;
    code: string;
    deviceId: string;
    expiresAt: Date;
    createdAt: Date;
    verifiedAt: Date | null;
    attempts: number;
    isVerified: boolean;
}
