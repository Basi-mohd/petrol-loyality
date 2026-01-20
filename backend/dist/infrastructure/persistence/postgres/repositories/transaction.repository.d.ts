import { Repository } from 'typeorm';
import { ITransactionRepository } from '../../../../domain/interfaces/repositories/transaction.repository.interface';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
export declare class TransactionRepository implements ITransactionRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<TransactionOrmEntity>);
    save(transaction: Transaction): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    findByCustomerId(customerId: string): Promise<Transaction[]>;
    findPendingSync(): Promise<Transaction[]>;
    findByStatus(status: string): Promise<Transaction[]>;
    countByCustomerId(customerId: string): Promise<number>;
    private toOrmEntity;
    private toDomainEntity;
}
