import { Injectable, Inject } from '@nestjs/common';
import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { LedgerEntry } from '../../../domain/entities/ledger-entry.entity';
import { Amount } from '../../../domain/value-objects/amount.vo';
import { TransactionType } from '../../../domain/enums/transaction-type.enum';

@Injectable()
export class AppendLedgerEntryUseCase {
  constructor(
    @Inject('ILedgerRepository')
    private readonly ledgerRepository: ILedgerRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(transactionId: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(
      transactionId,
    );

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const existingEntry =
      await this.ledgerRepository.findByTransactionId(transactionId);
    if (existingEntry) {
      return;
    }

    const lastEntry = await this.ledgerRepository.getLastEntry(
      transaction.customerId,
    );
    const previousHash = lastEntry?.hash || null;

    const ledgerEntry = LedgerEntry.create(
      transaction.id,
      transaction.customerId,
      transaction.amount,
      transaction.type,
      previousHash,
      transaction.metadata,
    );

    await this.ledgerRepository.append(ledgerEntry);
  }
}
