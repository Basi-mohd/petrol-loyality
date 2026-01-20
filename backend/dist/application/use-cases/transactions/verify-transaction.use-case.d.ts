import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
export declare class VerifyTransactionUseCase {
    private readonly transactionRepository;
    private readonly signatureVerificationService;
    constructor(transactionRepository: ITransactionRepository, signatureVerificationService: ISignatureVerificationService);
    execute(transactionId: string): Promise<boolean>;
}
