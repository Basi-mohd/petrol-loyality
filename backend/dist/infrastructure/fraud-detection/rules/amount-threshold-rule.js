"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountThresholdRule = void 0;
const fraud_risk_level_enum_1 = require("../../../domain/enums/fraud-risk-level.enum");
class AmountThresholdRule {
    constructor(maxSingleTransaction = 5000, suspiciousThreshold = 3000) {
        this.maxSingleTransaction = maxSingleTransaction;
        this.suspiciousThreshold = suspiciousThreshold;
    }
    async check(transaction) {
        const amount = transaction.amount.getValue();
        if (amount > this.maxSingleTransaction) {
            return {
                isViolated: true,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.CRITICAL,
                reason: `Transaction amount exceeds maximum: ${amount}`,
            };
        }
        if (amount > this.suspiciousThreshold) {
            return {
                isViolated: false,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.MEDIUM,
                reason: `Transaction amount is above suspicious threshold: ${amount}`,
            };
        }
        return {
            isViolated: false,
            riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.LOW,
            reason: 'Amount threshold check passed',
        };
    }
}
exports.AmountThresholdRule = AmountThresholdRule;
//# sourceMappingURL=amount-threshold-rule.js.map