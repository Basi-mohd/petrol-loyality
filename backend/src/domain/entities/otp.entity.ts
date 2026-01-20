export class Otp {
  private constructor(
    public readonly id: string,
    public readonly phoneNumber: string,
    public readonly code: string,
    public readonly deviceId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly verifiedAt: Date | null,
    public readonly attempts: number,
    public readonly isVerified: boolean,
  ) {}

  static create(
    id: string,
    phoneNumber: string,
    code: string,
    deviceId: string,
    expiresInMinutes: number = 2,
  ): Otp {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);
    return new Otp(
      id,
      phoneNumber,
      code,
      deviceId,
      expiresAt,
      now,
      null,
      0,
      false,
    );
  }

  static reconstruct(
    id: string,
    phoneNumber: string,
    code: string,
    deviceId: string,
    expiresAt: Date,
    createdAt: Date,
    verifiedAt: Date | null,
    attempts: number,
    isVerified: boolean,
  ): Otp {
    return new Otp(
      id,
      phoneNumber,
      code,
      deviceId,
      expiresAt,
      createdAt,
      verifiedAt,
      attempts,
      isVerified,
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  incrementAttempts(): Otp {
    return new Otp(
      this.id,
      this.phoneNumber,
      this.code,
      this.deviceId,
      this.expiresAt,
      this.createdAt,
      this.verifiedAt,
      this.attempts + 1,
      this.isVerified,
    );
  }

  verify(): Otp {
    if (this.isExpired()) {
      throw new Error('OTP has expired');
    }
    if (this.isVerified) {
      throw new Error('OTP already verified');
    }
    return new Otp(
      this.id,
      this.phoneNumber,
      this.code,
      this.deviceId,
      this.expiresAt,
      this.createdAt,
      new Date(),
      this.attempts,
      true,
    );
  }

  canAttempt(): boolean {
    return this.attempts < 5 && !this.isVerified && !this.isExpired();
  }
}
