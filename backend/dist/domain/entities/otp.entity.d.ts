export declare class Otp {
    readonly id: string;
    readonly phoneNumber: string;
    readonly code: string;
    readonly deviceId: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;
    readonly verifiedAt: Date | null;
    readonly attempts: number;
    readonly isVerified: boolean;
    private constructor();
    static create(id: string, phoneNumber: string, code: string, deviceId: string, expiresInMinutes?: number): Otp;
    static reconstruct(id: string, phoneNumber: string, code: string, deviceId: string, expiresAt: Date, createdAt: Date, verifiedAt: Date | null, attempts: number, isVerified: boolean): Otp;
    isExpired(): boolean;
    incrementAttempts(): Otp;
    verify(): Otp;
    canAttempt(): boolean;
}
