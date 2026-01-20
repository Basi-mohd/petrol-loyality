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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const transaction_status_enum_1 = require("../../domain/enums/transaction-status.enum");
let ReconciliationService = class ReconciliationService {
    constructor(ledgerRepository, transactionRepository) {
        this.ledgerRepository = ledgerRepository;
        this.transactionRepository = transactionRepository;
    }
    async reconcile(startDate, endDate) {
        const completedTransactions = await this.transactionRepository.findByStatus(transaction_status_enum_1.TransactionStatus.COMPLETED);
        const filteredTransactions = completedTransactions.filter((t) => t.timestamp >= startDate && t.timestamp <= endDate);
        const ledgerEntries = await this.ledgerRepository.findAll();
        const filteredLedgerEntries = ledgerEntries.filter((e) => e.timestamp >= startDate && e.timestamp <= endDate);
        const discrepancies = [];
        const transactionMap = new Map(filteredTransactions.map((t) => [t.id, t]));
        const ledgerMap = new Map(filteredLedgerEntries.map((e) => [e.transactionId, e]));
        for (const transaction of filteredTransactions) {
            const ledgerEntry = ledgerMap.get(transaction.id);
            if (!ledgerEntry) {
                discrepancies.push({
                    type: 'MISSING_LEDGER_ENTRY',
                    description: `Transaction ${transaction.id} has no ledger entry`,
                    amount: transaction.amount.getValue(),
                });
            }
            else if (ledgerEntry.amount.getValue() !== transaction.amount.getValue()) {
                discrepancies.push({
                    type: 'AMOUNT_MISMATCH',
                    description: `Transaction ${transaction.id} amount mismatch`,
                    amount: Math.abs(ledgerEntry.amount.getValue() - transaction.amount.getValue()),
                });
            }
        }
        for (const ledgerEntry of filteredLedgerEntries) {
            if (!transactionMap.has(ledgerEntry.transactionId)) {
                discrepancies.push({
                    type: 'ORPHAN_LEDGER_ENTRY',
                    description: `Ledger entry ${ledgerEntry.id} has no transaction`,
                    amount: ledgerEntry.amount.getValue(),
                });
            }
        }
        const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount.getValue(), 0);
        const isBalanced = discrepancies.length === 0;
        return {
            isBalanced,
            discrepancies,
            totalTransactions: filteredTransactions.length,
            totalAmount,
        };
    }
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ILedgerRepository')),
    __param(1, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object, Object])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map