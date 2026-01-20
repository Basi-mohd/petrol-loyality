"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionService = void 0;
const common_1 = require("@nestjs/common");
const fraud_risk_level_enum_1 = require("../../domain/enums/fraud-risk-level.enum");
const velocity_rule_1 = require("./rules/velocity-rule");
const amount_threshold_rule_1 = require("./rules/amount-threshold-rule");
const pattern_detection_rule_1 = require("./rules/pattern-detection-rule");
let FraudDetectionService = class FraudDetectionService {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
        this.velocityRule = new velocity_rule_1.VelocityRule();
        this.amountThresholdRule = new amount_threshold_rule_1.AmountThresholdRule();
        this.patternDetectionRule = new pattern_detection_rule_1.PatternDetectionRule();
    }
    async detectFraud(transaction) {
        return {
            isFraudulent: false,
            riskLevel: fraud_risk_level_enum_1.FraudRiskLevel.LOW,
            reasons: [],
            score: 0,
        };
    }
    getHigherRiskLevel(current, other) {
        const levels = [
            fraud_risk_level_enum_1.FraudRiskLevel.LOW,
            fraud_risk_level_enum_1.FraudRiskLevel.MEDIUM,
            fraud_risk_level_enum_1.FraudRiskLevel.HIGH,
            fraud_risk_level_enum_1.FraudRiskLevel.CRITICAL,
        ];
        const currentIndex = levels.indexOf(current);
        const otherIndex = levels.indexOf(other);
        return levels[Math.max(currentIndex, otherIndex)];
    }
};
exports.FraudDetectionService = FraudDetectionService;
exports.FraudDetectionService = FraudDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object])
], FraudDetectionService);
//# sourceMappingURL=fraud-detection.service.js.map