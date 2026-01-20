"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelocityRule = void 0;
const fraud_risk_level_enum_1 = require("../../../domain/enums/fraud-risk-level.enum");
class VelocityRule {
    constructor(maxTransactionsPerHour = 10, maxAmountPerHour = 10000) {
        this.maxTransactionsPerHour = maxTransactionsPerHour;
        this.maxAmountPerHour = maxAmountPerHour;
    }
    async check(transaction, recentTransactions) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recent = recentTransactions.filter((t) => t.timestamp >= oneHourAgo);
        const transactionCount = recent.length;
        const totalAmount = recent.reduce((sum, t) => sum + t.amount.getValue(), 0);
        if (transactionCount >= this.maxTransactionsPerHour) {
            return {
                isViolated: true,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.HIGH,
                reason: `Too many transactions in the last hour: ${transactionCount}`,
            };
        }
        if (totalAmount >= this.maxAmountPerHour) {
            return {
                isViolated: true,
                riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.MEDIUM,
                reason: `Total amount exceeds limit: ${totalAmount}`,
            };
        }
        return {
            isViolated: false,
            riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.LOW,
            reason: 'Velocity check passed',
        };
    }
}
exports.VelocityRule = VelocityRule;
//# sourceMappingURL=velocity-rule.js.map