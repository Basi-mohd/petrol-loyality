import { Transaction } from '../../entities/transaction.entity';
import { FraudRiskLevel } from '../../enums/fraud-risk-level.enum';

export interface FraudDetectionResult {
  isFraudulent: boolean;
  riskLevel: FraudRiskLevel;
  reasons: string[];
  score: number;
}

export interface IFraudDetectionService {
  detectFraud(transaction: Transaction): Promise<FraudDetectionResult>;
}
