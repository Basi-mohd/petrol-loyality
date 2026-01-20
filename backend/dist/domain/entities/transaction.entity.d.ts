import { Amount } from '../value-objects/amount.vo';
import { TransactionSignature } from '../value-objects/transaction-signature.vo';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';
export declare class Transaction {
    readonly id: string;
    readonly customerId: string;
    readonly amount: Amount;
    readonly type: TransactionType;
    readonly status: TransactionStatus;
    readonly signature: TransactionSignature;
    readonly timestamp: Date;
    readonly metadata: Record<string, any>;
    readonly previousHash?: string;
    readonly hash?: string;
    private constructor();
    static create(customerId: string, amount: Amount, type: TransactionType, signature: TransactionSignature, metadata?: Record<string, any>, previousHash?: string): Transaction;
    static reconstruct(id: string, customerId: string, amount: Amount, type: TransactionType, status: TransactionStatus, signature: TransactionSignature, timestamp: Date, metadata: Record<string, any>, previousHash?: string, hash?: string): Transaction;
    verifySignature(publicKey: string): boolean;
    markAsCompleted(): Transaction;
    markAsFailed(): Transaction;
    markAsSyncPending(): Transaction;
    markAsCancelled(): Transaction;
}
