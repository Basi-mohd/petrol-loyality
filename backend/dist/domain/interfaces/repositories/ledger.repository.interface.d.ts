import { LedgerEntry } from '../../entities/ledger-entry.entity';
import { LedgerHash } from '../../value-objects/ledger-hash.vo';
export interface ILedgerRepository {
    append(entry: LedgerEntry): Promise<void>;
    findById(id: string): Promise<LedgerEntry | null>;
    findByTransactionId(transactionId: string): Promise<LedgerEntry | null>;
    findByCustomerId(customerId: string): Promise<LedgerEntry[]>;
    getLastEntry(customerId?: string): Promise<LedgerEntry | null>;
    getLastHash(customerId?: string): Promise<LedgerHash | null>;
    verifyIntegrity(): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<LedgerEntry[]>;
}
