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
exports.ReviewFraudAlertUseCase = void 0;
const common_1 = require("@nestjs/common");
let ReviewFraudAlertUseCase = class ReviewFraudAlertUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(transactionId, isFraudulent) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        if (isFraudulent) {
            const cancelled = transaction.markAsCancelled();
            await this.transactionRepository.save(cancelled);
        }
        else {
            const completed = transaction.markAsCompleted();
            await this.transactionRepository.save(completed);
        }
    }
};
exports.ReviewFraudAlertUseCase = ReviewFraudAlertUseCase;
exports.ReviewFraudAlertUseCase = ReviewFraudAlertUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object])
], ReviewFraudAlertUseCase);
//# sourceMappingURL=review-fraud-alert.use-case.js.map