export class Amount {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new Error('Amount must be a finite number');
    }
  }

  static create(value: number): Amount {
    return new Amount(value);
  }

  getValue(): number {
    return this.value;
  }

  add(other: Amount): Amount {
    return new Amount(this.value + other.value);
  }

  subtract(other: Amount): Amount {
    if (this.value < other.value) {
      throw new Error('Insufficient balance');
    }
    return new Amount(this.value - other.value);
  }

  equals(other: Amount): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: Amount): boolean {
    return this.value > other.value;
  }
}
