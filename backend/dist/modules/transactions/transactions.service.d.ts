import { CreateTransactionUseCase } from '../../application/use-cases/transactions/create-transaction.use-case';
import { GetTransactionHistoryUseCase } from '../../application/use-cases/transactions/get-transaction-history.use-case';
import { VerifyTransactionUseCase } from '../../application/use-cases/transactions/verify-transaction.use-case';
import { SyncOfflineTransactionsUseCase } from '../../application/use-cases/transactions/sync-offline-transactions.use-case';
export declare class TransactionsService {
    private readonly createTransactionUseCase;
    private readonly getTransactionHistoryUseCase;
    private readonly verifyTransactionUseCase;
    private readonly syncOfflineTransactionsUseCase;
    constructor(createTransactionUseCase: CreateTransactionUseCase, getTransactionHistoryUseCase: GetTransactionHistoryUseCase, verifyTransactionUseCase: VerifyTransactionUseCase, syncOfflineTransactionsUseCase: SyncOfflineTransactionsUseCase);
}
