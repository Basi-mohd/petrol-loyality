import { Transaction } from '../../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByCustomerId(customerId: string): Promise<Transaction[]>;
  findPendingSync(): Promise<Transaction[]>;
  findByStatus(status: string): Promise<Transaction[]>;
  countByCustomerId(customerId: string): Promise<number>;
}
