import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';
export interface PatternDetectionRuleResult {
    isViolated: boolean;
    riskLevel: FraudRiskLevel;
    reason: string;
}
export declare class PatternDetectionRule {
    check(transaction: Transaction, recentTransactions: Transaction[]): Promise<PatternDetectionRuleResult>;
}
