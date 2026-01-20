import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { OfflineSyncDto } from '../../dto/sync/offline-sync.dto';
export declare class SyncOfflineTransactionsUseCase {
    private readonly transactionRepository;
    private readonly signatureVerificationService;
    constructor(transactionRepository: ITransactionRepository, signatureVerificationService: ISignatureVerificationService);
    execute(dto: OfflineSyncDto): Promise<{
        synced: number;
        failed: number;
        errors: string[];
    }>;
}
