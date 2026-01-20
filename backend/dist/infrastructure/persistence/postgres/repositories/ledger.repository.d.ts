import { Repository } from 'typeorm';
import { ILedgerRepository } from '../../../../domain/interfaces/repositories/ledger.repository.interface';
import { LedgerEntry } from '../../../../domain/entities/ledger-entry.entity';
import { LedgerEntryOrmEntity } from '../entities/ledger-entry.orm-entity';
import { LedgerHash } from '../../../../domain/value-objects/ledger-hash.vo';
export declare class LedgerRepository implements ILedgerRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<LedgerEntryOrmEntity>);
    append(entry: LedgerEntry): Promise<void>;
    findById(id: string): Promise<LedgerEntry | null>;
    findByTransactionId(transactionId: string): Promise<LedgerEntry | null>;
    findByCustomerId(customerId: string): Promise<LedgerEntry[]>;
    getLastEntry(customerId?: string): Promise<LedgerEntry | null>;
    getLastHash(customerId?: string): Promise<LedgerHash | null>;
    verifyIntegrity(): Promise<boolean>;
    findAll(limit?: number, offset?: number): Promise<LedgerEntry[]>;
    private toOrmEntity;
    private toDomainEntity;
}
