import { Injectable } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/transactions/create-transaction.use-case';
import { GetTransactionHistoryUseCase } from '../../application/use-cases/transactions/get-transaction-history.use-case';
import { VerifyTransactionUseCase } from '../../application/use-cases/transactions/verify-transaction.use-case';
import { SyncOfflineTransactionsUseCase } from '../../application/use-cases/transactions/sync-offline-transactions.use-case';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionHistoryUseCase: GetTransactionHistoryUseCase,
    private readonly verifyTransactionUseCase: VerifyTransactionUseCase,
    private readonly syncOfflineTransactionsUseCase: SyncOfflineTransactionsUseCase,
  ) {}
}
