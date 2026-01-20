export class PhoneNumber {
  private constructor(private readonly value: string) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new Error('Invalid phone number format');
    }
  }

  static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  getValue(): string {
    return this.value;
  }

  getCleaned(): string {
    return this.value.replace(/\D/g, '');
  }

  equals(other: PhoneNumber): boolean {
    return this.getCleaned() === other.getCleaned();
  }
}
