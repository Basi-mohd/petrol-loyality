import { LedgerHash } from '../value-objects/ledger-hash.vo';
import { Amount } from '../value-objects/amount.vo';
import { TransactionType } from '../enums/transaction-type.enum';
export declare class LedgerEntry {
    readonly id: string;
    readonly transactionId: string;
    readonly customerId: string;
    readonly amount: Amount;
    readonly type: TransactionType;
    readonly previousHash: LedgerHash | null;
    readonly hash: LedgerHash;
    readonly timestamp: Date;
    readonly metadata: Record<string, any>;
    private constructor();
    static create(transactionId: string, customerId: string, amount: Amount, type: TransactionType, previousHash: LedgerHash | null, metadata?: Record<string, any>): LedgerEntry;
    static reconstruct(id: string, transactionId: string, customerId: string, amount: Amount, type: TransactionType, previousHash: LedgerHash | null, hash: LedgerHash, timestamp: Date, metadata: Record<string, any>): LedgerEntry;
    verifyIntegrity(previousHash: LedgerHash | null): boolean;
}
