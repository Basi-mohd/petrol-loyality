import { IFraudDetectionService } from '../../../domain/interfaces/services/fraud-detection.service.interface';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudDetectionResult } from '../../../domain/interfaces/services/fraud-detection.service.interface';
export declare class DetectFraudUseCase {
    private readonly fraudDetectionService;
    constructor(fraudDetectionService: IFraudDetectionService);
    execute(transaction: Transaction): Promise<FraudDetectionResult>;
}
