export class CustomerQrIdentity {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly qrToken: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly expiresAt: Date | null,
  ) {}

  static create(
    id: string,
    customerId: string,
    qrToken: string,
    expiresAt: Date | null = null,
  ): CustomerQrIdentity {
    return new CustomerQrIdentity(
      id,
      customerId,
      qrToken,
      true,
      new Date(),
      expiresAt,
    );
  }

  static reconstruct(
    id: string,
    customerId: string,
    qrToken: string,
    isActive: boolean,
    createdAt: Date,
    expiresAt: Date | null,
  ): CustomerQrIdentity {
    return new CustomerQrIdentity(
      id,
      customerId,
      qrToken,
      isActive,
      createdAt,
      expiresAt,
    );
  }

  deactivate(): CustomerQrIdentity {
    return new CustomerQrIdentity(
      this.id,
      this.customerId,
      this.qrToken,
      false,
      this.createdAt,
      this.expiresAt,
    );
  }

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }
}
