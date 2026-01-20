import { Injectable, Inject } from '@nestjs/common';
import {
  IReconciliationService,
  ReconciliationResult,
} from '../../domain/interfaces/services/reconciliation.service.interface';
import { ILedgerRepository } from '../../domain/interfaces/repositories/ledger.repository.interface';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class ReconciliationService implements IReconciliationService {
  constructor(
    @Inject('ILedgerRepository')
    private readonly ledgerRepository: ILedgerRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async reconcile(
    startDate: Date,
    endDate: Date,
  ): Promise<ReconciliationResult> {
    const completedTransactions =
      await this.transactionRepository.findByStatus(
        TransactionStatus.COMPLETED,
      );

    const filteredTransactions = completedTransactions.filter(
      (t) => t.timestamp >= startDate && t.timestamp <= endDate,
    );

    const ledgerEntries = await this.ledgerRepository.findAll();
    const filteredLedgerEntries = ledgerEntries.filter(
      (e) => e.timestamp >= startDate && e.timestamp <= endDate,
    );

    const discrepancies: Array<{
      type: string;
      description: string;
      amount: number;
    }> = [];

    const transactionMap = new Map(
      filteredTransactions.map((t) => [t.id, t]),
    );
    const ledgerMap = new Map(
      filteredLedgerEntries.map((e) => [e.transactionId, e]),
    );

    for (const transaction of filteredTransactions) {
      const ledgerEntry:any = ledgerMap.get(transaction.id);
      if (!ledgerEntry) {
        discrepancies.push({
          type: 'MISSING_LEDGER_ENTRY',
          description: `Transaction ${transaction.id} has no ledger entry`,
          amount: transaction.amount.getValue(),
        });
      } else if (
        ledgerEntry.amount.getValue() !== transaction.amount.getValue()
      ) {
        discrepancies.push({
          type: 'AMOUNT_MISMATCH',
          description: `Transaction ${transaction.id} amount mismatch`,
          amount: Math.abs(
            ledgerEntry.amount.getValue() - transaction.amount.getValue(),
          ),
        });
      }
    }

    for (const ledgerEntry of filteredLedgerEntries) {
      if (!transactionMap.has(ledgerEntry.transactionId)) {
        discrepancies.push({
          type: 'ORPHAN_LEDGER_ENTRY',
          description: `Ledger entry ${ledgerEntry.id} has no transaction`,
          amount: ledgerEntry.amount.getValue(),
        });
      }
    }

    const totalAmount = filteredTransactions.reduce(
      (sum, t) => sum + t.amount.getValue(),
      0,
    );

    const isBalanced = discrepancies.length === 0;

    return {
      isBalanced,
      discrepancies,
      totalTransactions: filteredTransactions.length,
      totalAmount,
    };
  }
}
