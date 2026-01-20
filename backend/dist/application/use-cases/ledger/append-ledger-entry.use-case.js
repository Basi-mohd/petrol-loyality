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
exports.AppendLedgerEntryUseCase = void 0;
const common_1 = require("@nestjs/common");
const ledger_entry_entity_1 = require("../../../domain/entities/ledger-entry.entity");
let AppendLedgerEntryUseCase = class AppendLedgerEntryUseCase {
    constructor(ledgerRepository, transactionRepository) {
        this.ledgerRepository = ledgerRepository;
        this.transactionRepository = transactionRepository;
    }
    async execute(transactionId) {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        const existingEntry = await this.ledgerRepository.findByTransactionId(transactionId);
        if (existingEntry) {
            return;
        }
        const lastEntry = await this.ledgerRepository.getLastEntry(transaction.customerId);
        const previousHash = lastEntry?.hash || null;
        const ledgerEntry = ledger_entry_entity_1.LedgerEntry.create(transaction.id, transaction.customerId, transaction.amount, transaction.type, previousHash, transaction.metadata);
        await this.ledgerRepository.append(ledgerEntry);
    }
};
exports.AppendLedgerEntryUseCase = AppendLedgerEntryUseCase;
exports.AppendLedgerEntryUseCase = AppendLedgerEntryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ILedgerRepository')),
    __param(1, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object, Object])
], AppendLedgerEntryUseCase);
//# sourceMappingURL=append-ledger-entry.use-case.js.map