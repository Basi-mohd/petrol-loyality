import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';

export interface AmountThresholdRuleResult {
  isViolated: boolean;
  riskLevel: FraudRiskLevel;
  reason: string;
}

export class AmountThresholdRule {
  constructor(
    private readonly maxSingleTransaction: number = 5000,
    private readonly suspiciousThreshold: number = 3000,
  ) {}

  async check(transaction: Transaction): Promise<AmountThresholdRuleResult> {
    const amount = transaction.amount.getValue();

    if (amount > this.maxSingleTransaction) {
      return {
        isViolated: true,
        riskLevel: FraudRiskLevel.CRITICAL,
        reason: `Transaction amount exceeds maximum: ${amount}`,
      };
    }

    if (amount > this.suspiciousThreshold) {
      return {
        isViolated: false,
        riskLevel: FraudRiskLevel.MEDIUM,
        reason: `Transaction amount is above suspicious threshold: ${amount}`,
      };
    }

    return {
      isViolated: false,
      riskLevel: FraudRiskLevel.LOW,
      reason: 'Amount threshold check passed',
    };
  }
}
