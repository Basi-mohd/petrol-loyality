import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILedgerRepository } from '../../../../domain/interfaces/repositories/ledger.repository.interface';
import { LedgerEntry } from '../../../../domain/entities/ledger-entry.entity';
import { LedgerEntryOrmEntity } from '../entities/ledger-entry.orm-entity';
import { LedgerHash } from '../../../../domain/value-objects/ledger-hash.vo';
import { Amount } from '../../../../domain/value-objects/amount.vo';
import { TransactionType } from '../../../../domain/enums/transaction-type.enum';

@Injectable()
export class LedgerRepository implements ILedgerRepository {
  constructor(
    @InjectRepository(LedgerEntryOrmEntity)
    private readonly ormRepository: Repository<LedgerEntryOrmEntity>,
  ) {}

  async append(entry: LedgerEntry): Promise<void> {
    const ormEntity = this.toOrmEntity(entry);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<LedgerEntry | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<LedgerEntry | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { transactionId },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<LedgerEntry[]> {
    const ormEntities = await this.ormRepository.find({
      where: { customerId },
      order: { timestamp: 'ASC' },
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async getLastEntry(customerId?: string): Promise<LedgerEntry | null> {
    const query = this.ormRepository
      .createQueryBuilder('ledger')
      .orderBy('ledger.timestamp', 'DESC')
      .limit(1);

    if (customerId) {
      query.where('ledger.customerId = :customerId', { customerId });
    }

    const ormEntity = await query.getOne();
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async getLastHash(customerId?: string): Promise<LedgerHash | null> {
    const lastEntry = await this.getLastEntry(customerId);
    return lastEntry ? lastEntry.hash : null;
  }

  async verifyIntegrity(): Promise<boolean> {
    const entries = await this.ormRepository.find({
      order: { timestamp: 'ASC' },
    });

    let previousHash: LedgerHash | null = null;
    for (const entry of entries) {
      const domainEntry = this.toDomainEntity(entry);
      if (!domainEntry.verifyIntegrity(previousHash)) {
        return false;
      }
      previousHash = domainEntry.hash;
    }

    return true;
  }

  async findAll(limit?: number, offset?: number): Promise<LedgerEntry[]> {
    const query = this.ormRepository
      .createQueryBuilder('ledger')
      .orderBy('ledger.timestamp', 'ASC');

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }

    const ormEntities = await query.getMany();
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  private toOrmEntity(entry: LedgerEntry): LedgerEntryOrmEntity {
    const entity = new LedgerEntryOrmEntity();
    entity.id = entry.id;
    entity.transactionId = entry.transactionId;
    entity.customerId = entry.customerId;
    entity.amount = entry.amount.getValue();
    entity.type = entry.type;
    entity.previousHash = entry.previousHash?.getValue() || null;
    entity.hash = entry.hash.getValue();
    entity.timestamp = entry.timestamp;
    entity.metadata = entry.metadata;
    return entity;
  }

  private toDomainEntity(ormEntity: LedgerEntryOrmEntity): LedgerEntry {
    const amountValue = typeof ormEntity.amount === 'string' 
      ? parseFloat(ormEntity.amount) 
      : Number(ormEntity.amount);
    
    return LedgerEntry.reconstruct(
      ormEntity.id,
      ormEntity.transactionId,
      ormEntity.customerId,
      Amount.create(amountValue),
      ormEntity.type as TransactionType,
      ormEntity.previousHash
        ? LedgerHash.create(ormEntity.previousHash)
        : null,
      LedgerHash.create(ormEntity.hash),
      ormEntity.timestamp,
      ormEntity.metadata || {},
    );
  }
}
