import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';
export interface VelocityRuleResult {
    isViolated: boolean;
    riskLevel: FraudRiskLevel;
    reason: string;
}
export declare class VelocityRule {
    private readonly maxTransactionsPerHour;
    private readonly maxAmountPerHour;
    constructor(maxTransactionsPerHour?: number, maxAmountPerHour?: number);
    check(transaction: Transaction, recentTransactions: Transaction[]): Promise<VelocityRuleResult>;
}
