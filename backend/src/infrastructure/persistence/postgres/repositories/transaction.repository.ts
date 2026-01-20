import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../../../domain/interfaces/repositories/transaction.repository.interface';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { Amount } from '../../../../domain/value-objects/amount.vo';
import { TransactionSignature } from '../../../../domain/value-objects/transaction-signature.vo';
import { TransactionType } from '../../../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly ormRepository: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: Transaction): Promise<void> {
    const ormEntity = this.toOrmEntity(transaction);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<Transaction | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const ormEntities = await this.ormRepository.find({
      where: { customerId },
      order: { timestamp: 'DESC' },
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async findPendingSync(): Promise<Transaction[]> {
    const ormEntities = await this.ormRepository.find({
      where: { status: TransactionStatus.SYNC_PENDING },
      order: { timestamp: 'ASC' },
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async findByStatus(status: string): Promise<Transaction[]> {
    const ormEntities = await this.ormRepository.find({
      where: { status },
      order: { timestamp: 'DESC' },
    });
    return ormEntities.map((entity) => this.toDomainEntity(entity));
  }

  async countByCustomerId(customerId: string): Promise<number> {
    return this.ormRepository.count({ where: { customerId } });
  }

  private toOrmEntity(transaction: Transaction): TransactionOrmEntity {
    const entity = new TransactionOrmEntity();
    entity.id = transaction.id;
    entity.customerId = transaction.customerId;
    entity.amount = transaction.amount.getValue();
    entity.type = transaction.type;
    entity.status = transaction.status;
    entity.signature = transaction.signature.getSignature();
    entity.publicKey = transaction.signature.getPublicKey();
    entity.timestamp = transaction.timestamp;
    entity.metadata = transaction.metadata;
    entity.previousHash = transaction.previousHash;
    entity.hash = transaction.hash;
    return entity;
  }

  private toDomainEntity(ormEntity: TransactionOrmEntity): Transaction {
    return Transaction.reconstruct(
      ormEntity.id,
      ormEntity.customerId,
      Amount.create(ormEntity.amount),
      ormEntity.type as TransactionType,
      ormEntity.status as TransactionStatus,
      TransactionSignature.create(ormEntity.signature, ormEntity.publicKey),
      ormEntity.timestamp,
      ormEntity.metadata || {},
      ormEntity.previousHash,
      ormEntity.hash,
    );
  }
}
