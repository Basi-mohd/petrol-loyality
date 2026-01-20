export class LedgerHash {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Hash cannot be empty');
    }
    if (!/^[a-f0-9]{64}$/i.test(value)) {
      throw new Error('Invalid hash format');
    }
  }

  static create(value: string): LedgerHash {
    return new LedgerHash(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: LedgerHash): boolean {
    return this.value === other.value;
  }
}
