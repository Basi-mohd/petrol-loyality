import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';
export interface AmountThresholdRuleResult {
    isViolated: boolean;
    riskLevel: FraudRiskLevel;
    reason: string;
}
export declare class AmountThresholdRule {
    private readonly maxSingleTransaction;
    private readonly suspiciousThreshold;
    constructor(maxSingleTransaction?: number, suspiciousThreshold?: number);
    check(transaction: Transaction): Promise<AmountThresholdRuleResult>;
}
