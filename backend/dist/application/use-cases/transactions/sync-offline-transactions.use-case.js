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
exports.SyncOfflineTransactionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const transaction_entity_1 = require("../../../domain/entities/transaction.entity");
const amount_vo_1 = require("../../../domain/value-objects/amount.vo");
const transaction_signature_vo_1 = require("../../../domain/value-objects/transaction-signature.vo");
const transaction_status_enum_1 = require("../../../domain/enums/transaction-status.enum");
let SyncOfflineTransactionsUseCase = class SyncOfflineTransactionsUseCase {
    constructor(transactionRepository, signatureVerificationService) {
        this.transactionRepository = transactionRepository;
        this.signatureVerificationService = signatureVerificationService;
    }
    async execute(dto) {
        let synced = 0;
        let failed = 0;
        const errors = [];
        for (const txData of dto.transactions) {
            try {
                const existing = await this.transactionRepository.findById(txData.id);
                if (existing) {
                    continue;
                }
                const transactionData = JSON.stringify({
                    id: txData.id,
                    customerId: txData.customerId,
                    amount: txData.amount,
                    type: txData.type,
                    timestamp: txData.timestamp,
                });
                const signature = transaction_signature_vo_1.TransactionSignature.create(txData.signature, txData.publicKey);
                const isValid = await this.signatureVerificationService.verify(signature, transactionData);
                if (!isValid) {
                    failed++;
                    errors.push(`Invalid signature for transaction ${txData.id}`);
                    continue;
                }
                const transaction = transaction_entity_1.Transaction.reconstruct(txData.id, txData.customerId, amount_vo_1.Amount.create(txData.amount), txData.type, transaction_status_enum_1.TransactionStatus.SYNC_PENDING, signature, new Date(txData.timestamp), txData.metadata || {});
                await this.transactionRepository.save(transaction);
                synced++;
            }
            catch (error) {
                failed++;
                errors.push(`Error syncing transaction ${txData.id}: ${error.message}`);
            }
        }
        return { synced, failed, errors };
    }
};
exports.SyncOfflineTransactionsUseCase = SyncOfflineTransactionsUseCase;
exports.SyncOfflineTransactionsUseCase = SyncOfflineTransactionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __param(1, (0, common_1.Inject)('ISignatureVerificationService')),
    __metadata("design:paramtypes", [Object, Object])
], SyncOfflineTransactionsUseCase);
//# sourceMappingURL=sync-offline-transactions.use-case.js.map