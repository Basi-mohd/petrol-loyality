import { Transaction } from '../../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../../domain/enums/fraud-risk-level.enum';

export interface PatternDetectionRuleResult {
  isViolated: boolean;
  riskLevel: FraudRiskLevel;
  reason: string;
}

export class PatternDetectionRule {
  async check(
    transaction: Transaction,
    recentTransactions: Transaction[],
  ): Promise<PatternDetectionRuleResult> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const veryRecent = recentTransactions.filter(
      (t) => t.timestamp >= fiveMinutesAgo,
    );

    if (veryRecent.length >= 5) {
      return {
        isViolated: true,
        riskLevel: FraudRiskLevel.HIGH,
        reason: 'Multiple transactions in a very short time window',
      };
    }

    const sameAmountCount = recentTransactions.filter(
      (t) => t.amount.getValue() === transaction.amount.getValue(),
    ).length;

    if (sameAmountCount >= 3) {
      return {
        isViolated: true,
        riskLevel: FraudRiskLevel.MEDIUM,
        reason: 'Multiple transactions with identical amounts',
      };
    }

    return {
      isViolated: false,
      riskLevel: FraudRiskLevel.LOW,
      reason: 'Pattern detection check passed',
    };
  }
}
