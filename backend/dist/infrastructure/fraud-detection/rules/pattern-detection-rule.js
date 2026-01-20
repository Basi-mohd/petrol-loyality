"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternDetectionRule = void 0;
const fraud_risk_level_enum_1 = require("../../../domain/enums/fraud-risk-level.enum");
class PatternDetectionRule {
    async check(transaction, recentTransactions) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const veryRecent = recentTransactions.filter((t) => t.timestamp >= fiveMinutesAgo);
        if (veryRecent.length >= 5) {
            return {
                isViolated: true,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.HIGH,
                reason: 'Multiple transactions in a very short time window',
            };
        }
        const sameAmountCount = recentTransactions.filter((t) => t.amount.getValue() === transaction.amount.getValue()).length;
        if (sameAmountCount >= 3) {
            return {
                isViolated: true,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.MEDIUM,
                reason: 'Multiple transactions with identical amounts',
            };
        }
        return {
            isViolated: false,
            riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.LOW,
            reason: 'Pattern detection check passed',
        };
    }
}
exports.PatternDetectionRule = PatternDetectionRule;
//# sourceMappingURL=pattern-detection-rule.js.map