import { Transaction } from '../../entities/transaction.entity';
import { FraudRiskLevel } from '../../enums/fraud-risk-level.enum';

export class FraudDetectedEvent {
  constructor(
    public readonly transaction: Transaction,
    public readonly riskLevel: FraudRiskLevel,
    public readonly reasons: string[],
  ) {}
}
