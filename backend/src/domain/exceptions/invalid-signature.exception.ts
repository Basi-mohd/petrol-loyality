import { DomainException } from './domain-exception';

export class InvalidSignatureException extends DomainException {
  constructor(message: string = 'Invalid transaction signature') {
    super(message, 'INVALID_SIGNATURE', 400);
    this.name = 'InvalidSignatureException';
  }
}
