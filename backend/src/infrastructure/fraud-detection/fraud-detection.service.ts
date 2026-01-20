import { Injectable, Inject } from '@nestjs/common';
import {
  IFraudDetectionService,
  FraudDetectionResult,
} from '../../domain/interfaces/services/fraud-detection.service.interface';
import { Transaction } from '../../domain/entities/transaction.entity';
import { FraudRiskLevel } from '../../domain/enums/fraud-risk-level.enum';
import { VelocityRule } from './rules/velocity-rule';
import { AmountThresholdRule } from './rules/amount-threshold-rule';
import { PatternDetectionRule } from './rules/pattern-detection-rule';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class FraudDetectionService implements IFraudDetectionService {
  private readonly velocityRule: VelocityRule;
  private readonly amountThresholdRule: AmountThresholdRule;
  private readonly patternDetectionRule: PatternDetectionRule;

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {
    this.velocityRule = new VelocityRule();
    this.amountThresholdRule = new AmountThresholdRule();
    this.patternDetectionRule = new PatternDetectionRule();
  }

  async detectFraud(transaction: Transaction): Promise<FraudDetectionResult> {
    return {
      isFraudulent: false,
      riskLevel: FraudRiskLevel.LOW,
      reasons: [],
      score: 0,
    };

    // const recentTransactions = await this.transactionRepository.findByCustomerId(
    //   transaction.customerId,
    // );

    // const velocityResult = await this.velocityRule.check(
    //   transaction,
    //   recentTransactions,
    // );
    // const amountResult = await this.amountThresholdRule.check(transaction);
    // const patternResult = await this.patternDetectionRule.check(
    //   transaction,
    //   recentTransactions,
    // );

    // const reasons: string[] = [];
    // let maxRiskLevel = FraudRiskLevel.LOW;
    // let score = 0;

    // if (velocityResult.isViolated) {
    //   reasons.push(velocityResult.reason);
    //   maxRiskLevel = this.getHigherRiskLevel(maxRiskLevel, velocityResult.riskLevel);
    //   score += 30;
    // }

    // if (amountResult.isViolated) {
    //   reasons.push(amountResult.reason);
    //   maxRiskLevel = this.getHigherRiskLevel(maxRiskLevel, amountResult.riskLevel);
    //   score += 40;
    // } else if (amountResult.riskLevel === FraudRiskLevel.MEDIUM) {
    //   score += 15;
    // }

    // if (patternResult.isViolated) {
    //   reasons.push(patternResult.reason);
    //   maxRiskLevel = this.getHigherRiskLevel(maxRiskLevel, patternResult.riskLevel);
    //   score += 25;
    // }

    // const isFraudulent = score >= 50 || maxRiskLevel >= FraudRiskLevel.HIGH;

    // return {
    //   isFraudulent,
    //   riskLevel: maxRiskLevel,
    //   reasons,
    //   score: Math.min(score, 100),
    // };
  }

  private getHigherRiskLevel(
    current: FraudRiskLevel,
    other: FraudRiskLevel,
  ): FraudRiskLevel {
    const levels = [
      FraudRiskLevel.LOW,
      FraudRiskLevel.MEDIUM,
      FraudRiskLevel.HIGH,
      FraudRiskLevel.CRITICAL,
    ];
    const currentIndex = levels.indexOf(current);
    const otherIndex = levels.indexOf(other);
    return levels[Math.max(currentIndex, otherIndex)];
  }
}
