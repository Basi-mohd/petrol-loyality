import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';

export interface VelocityRuleResult {
  isViolated: boolean;
  riskLevel: FraudRiskLevel;
  reason: string;
}

export class VelocityRule {
  constructor(
    private readonly maxTransactionsPerHour: number = 10,
    private readonly maxAmountPerHour: number = 10000,
  ) {}

  async check(
    transaction: Transaction,
    recentTransactions: Transaction[],
  ): Promise<VelocityRuleResult> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = recentTransactions.filter(
      (t) => t.timestamp >= oneHourAgo,
    );

    const transactionCount = recent.length;
    const totalAmount = recent.reduce(
      (sum, t) => sum + t.amount.getValue(),
      0,
    );

    if (transactionCount >= this.maxTransactionsPerHour) {
      return {
        isViolated: true,
        riskLevel: FraudRiskLevel.HIGH,
        reason: `Too many transactions in the last hour: ${transactionCount}`,
      };
    }

    if (totalAmount >= this.maxAmountPerHour) {
      return {
        isViolated: true,
        riskLevel: FraudRiskLevel.MEDIUM,
        reason: `Total amount exceeds limit: ${totalAmount}`,
      };
    }

    return {
      isViolated: false,
      riskLevel: FraudRiskLevel.LOW,
      reason: 'Velocity check passed',
    };
  }
}
