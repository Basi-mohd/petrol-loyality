import { PhoneNumber } from '../value-objects/phone-number.vo';
import { Amount } from '../value-objects/amount.vo';

export class Customer {
  private constructor(
    public readonly id: string,
    public readonly phoneNumber: PhoneNumber,
    public readonly name: string,
    public readonly balance: Amount,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean,
  ) {}

  static create(
    id: string,
    phoneNumber: PhoneNumber,
    name: string,
    initialBalance: Amount = Amount.create(0),
  ): Customer {
    const now = new Date();
    return new Customer(
      id,
      phoneNumber,
      name,
      initialBalance,
      now,
      now,
      true,
    );
  }

  static reconstruct(
    id: string,
    phoneNumber: PhoneNumber,
    name: string,
    balance: Amount,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
  ): Customer {
    return new Customer(
      id,
      phoneNumber,
      name,
      balance,
      createdAt,
      updatedAt,
      isActive,
    );
  }

  credit(amount: Amount): Customer {
    return new Customer(
      this.id,
      this.phoneNumber,
      this.name,
      this.balance.add(amount),
      this.createdAt,
      new Date(),
      this.isActive,
    );
  }

  debit(amount: Amount): Customer {
    if (this.balance.isGreaterThan(amount) || this.balance.equals(amount)) {
      return new Customer(
        this.id,
        this.phoneNumber,
        this.name,
        this.balance.subtract(amount),
        this.createdAt,
        new Date(),
        this.isActive,
      );
    }
    throw new Error('Insufficient balance');
  }

  deactivate(): Customer {
    return new Customer(
      this.id,
      this.phoneNumber,
      this.name,
      this.balance,
      this.createdAt,
      new Date(),
      false,
    );
  }

  activate(): Customer {
    return new Customer(
      this.id,
      this.phoneNumber,
      this.name,
      this.balance,
      this.createdAt,
      new Date(),
      true,
    );
  }
}
