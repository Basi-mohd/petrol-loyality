import { CreateTransactionUseCase } from '../../../application/use-cases/transactions/create-transaction.use-case';
import { GetTransactionHistoryUseCase } from '../../../application/use-cases/transactions/get-transaction-history.use-case';
import { VerifyTransactionUseCase } from '../../../application/use-cases/transactions/verify-transaction.use-case';
import { SyncOfflineTransactionsUseCase } from '../../../application/use-cases/transactions/sync-offline-transactions.use-case';
import { CreateTransactionRequestDto } from '../../dto/transactions/create-transaction-request.dto';
import { OfflineSyncDto } from '../../../application/dto/sync/offline-sync.dto';
export declare class TransactionsController {
    private readonly createTransactionUseCase;
    private readonly getTransactionHistoryUseCase;
    private readonly verifyTransactionUseCase;
    private readonly syncOfflineTransactionsUseCase;
    private readonly logger;
    constructor(createTransactionUseCase: CreateTransactionUseCase, getTransactionHistoryUseCase: GetTransactionHistoryUseCase, verifyTransactionUseCase: VerifyTransactionUseCase, syncOfflineTransactionsUseCase: SyncOfflineTransactionsUseCase);
    create(dto: CreateTransactionRequestDto): Promise<import("../../../application/dto/transactions/transaction-response.dto").TransactionResponseDto>;
    getHistory(customerId: string): Promise<import("../../../application/dto/transactions/transaction-response.dto").TransactionResponseDto[]>;
    verify(transactionId: string): Promise<boolean>;
    sync(dto: OfflineSyncDto): Promise<{
        synced: number;
        failed: number;
        errors: string[];
    }>;
}
