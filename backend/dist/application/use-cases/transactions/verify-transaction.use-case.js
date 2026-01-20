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
exports.VerifyTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
let VerifyTransactionUseCase = class VerifyTransactionUseCase {
    constructor(transactionRepository, signatureVerificationService) {
        this.transactionRepository = transactionRepository;
        this.signatureVerificationService = signatureVerificationService;
    }
    async execute(transactionId) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        const transactionData = JSON.stringify({
            id: transaction.id,
            customerId: transaction.customerId,
            amount: transaction.amount.getValue(),
            type: transaction.type,
            timestamp: transaction.timestamp.toISOString(),
        });
        return this.signatureVerificationService.verify(transaction.signature, transactionData);
    }
};
exports.VerifyTransactionUseCase = VerifyTransactionUseCase;
exports.VerifyTransactionUseCase = VerifyTransactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __param(1, (0, common_1.Inject)('ISignatureVerificationService')),
    __metadata("design:paramtypes", [Object, Object])
], VerifyTransactionUseCase);
//# sourceMappingURL=verify-transaction.use-case.js.map