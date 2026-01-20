import { Amount } from '../value-objects/amount.vo';

export class LoyaltyAccount {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly points: number,
    public readonly totalSpent: Amount,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(customerId: string, initialPoints: number = 0): LoyaltyAccount {
    const id = `loyalty-${customerId}`;
    const now = new Date();
    return new LoyaltyAccount(
      id,
      customerId,
      initialPoints,
      Amount.create(0),
      now,
      now,
    );
  }

  static reconstruct(
    id: string,
    customerId: string,
    points: number,
    totalSpent: Amount,
    createdAt: Date,
    updatedAt: Date,
  ): LoyaltyAccount {
    return new LoyaltyAccount(
      id,
      customerId,
      points,
      totalSpent,
      createdAt,
      updatedAt,
    );
  }

  addPoints(points: number, amount: Amount): LoyaltyAccount {
    return new LoyaltyAccount(
      this.id,
      this.customerId,
      this.points + points,
      this.totalSpent.add(amount),
      this.createdAt,
      new Date(),
    );
  }

  redeemPoints(points: number): LoyaltyAccount {
    if (this.points < points) {
      throw new Error('Insufficient points');
    }
    return new LoyaltyAccount(
      this.id,
      this.customerId,
      this.points - points,
      this.totalSpent,
      this.createdAt,
      new Date(),
    );
  }
}
