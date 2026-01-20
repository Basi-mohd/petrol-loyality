import { IFraudDetectionService, FraudDetectionResult } from '../../domain/interfaces/services/fraud-detection.service.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
export declare class FraudDetectionService implements IFraudDetectionService {
    private readonly transactionRepository;
    private readonly velocityRule;
    private readonly amountThresholdRule;
    private readonly patternDetectionRule;
    constructor(transactionRepository: ITransactionRepository);
    detectFraud(transaction: Transaction): Promise<FraudDetectionResult>;
    private getHigherRiskLevel;
}
