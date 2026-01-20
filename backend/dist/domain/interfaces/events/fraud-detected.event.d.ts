import { Transaction } from '../../entities/transaction.entity';
import { FraudRiskLevel } from '../../enums/fraud-risk-level.enum';
export declare class FraudDetectedEvent {
    readonly transaction: Transaction;
    readonly riskLevel: FraudRiskLevel;
    readonly reasons: string[];
    constructor(transaction: Transaction, riskLevel: FraudRiskLevel, reasons: string[]);
}
