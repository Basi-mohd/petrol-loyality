import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IFraudDetectionService } from '../../../domain/interfaces/services/fraud-detection.service.interface';
import { ISignatureVerificationService } from '../../../domain/interfaces/services/signature-verification.service.interface';
import { CreateTransactionDto } from '../../dto/transactions/create-transaction.dto';
import { TransactionResponseDto } from '../../dto/transactions/transaction-response.dto';
export declare class CreateTransactionUseCase {
    private readonly transactionRepository;
    private readonly ledgerRepository;
    private readonly customerRepository;
    private readonly fraudDetectionService;
    private readonly signatureVerificationService;
    constructor(transactionRepository: ITransactionRepository, ledgerRepository: ILedgerRepository, customerRepository: ICustomerRepository, fraudDetectionService: IFraudDetectionService, signatureVerificationService: ISignatureVerificationService);
    execute(dto: CreateTransactionDto): Promise<TransactionResponseDto>;
}
