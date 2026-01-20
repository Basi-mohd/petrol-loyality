import { DomainException } from './domain-exception';
export declare class InsufficientBalanceException extends DomainException {
    constructor(required: number, available: number);
}
