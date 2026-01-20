"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectedEvent = void 0;
class FraudDetectedEvent {
    constructor(transaction, riskLevel, reasons) {
        this.transaction = transaction;
        this.riskLevel = riskLevel;
        this.reasons = reasons;
    }
}
exports.FraudDetectedEvent = FraudDetectedEvent;
//# sourceMappingURL=fraud-detected.event.js.map