"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
class Otp {
    constructor(id, phoneNumber, code, deviceId, expiresAt, createdAt, verifiedAt, attempts, isVerified) {
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.code = code;
        this.deviceId = deviceId;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.verifiedAt = verifiedAt;
        this.attempts = attempts;
        this.isVerified = isVerified;
    }
    static create(id, phoneNumber, code, deviceId, expiresInMinutes = 2) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
        return new Otp(id, phoneNumber, code, deviceId, expiresAt, now, null, 0, false);
    }
    static reconstruct(id, phoneNumber, code, deviceId, expiresAt, createdAt, verifiedAt, attempts, isVerified) {
        return new Otp(id, phoneNumber, code, deviceId, expiresAt, createdAt, verifiedAt, attempts, isVerified);
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    incrementAttempts() {
        return new Otp(this.id, this.phoneNumber, this.code, this.deviceId, this.expiresAt, this.createdAt, this.verifiedAt, this.attempts + 1, this.isVerified);
    }
    verify() {
        if (this.isExpired()) {
            throw new Error('OTP has expired');
        }
        if (this.isVerified) {
            throw new Error('OTP already verified');
        }
        return new Otp(this.id, this.phoneNumber, this.code, this.deviceId, this.expiresAt, this.createdAt, new Date(), this.attempts, true);
    }
    canAttempt() {
        return this.attempts < 5 && !this.isVerified && !this.isExpired();
    }
}
exports.Otp = Otp;
//# sourceMappingURL=otp.entity.js.map