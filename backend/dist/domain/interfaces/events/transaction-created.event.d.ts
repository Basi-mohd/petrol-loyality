import { Transaction } from '../../entities/transaction.entity';
export declare class TransactionCreatedEvent {
    readonly transaction: Transaction;
    constructor(transaction: Transaction);
}
