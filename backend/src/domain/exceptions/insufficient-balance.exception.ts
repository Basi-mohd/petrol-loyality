import { DomainException } from './domain-exception';

export class InsufficientBalanceException extends DomainException {
  constructor(required: number, available: number) {
    super(
      `Insufficient balance. Required: ${required}, Available: ${available}`,
      'INSUFFICIENT_BALANCE',
      400,
    );
    this.name = 'InsufficientBalanceException';
  }
}
