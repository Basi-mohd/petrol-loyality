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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const create_transaction_use_case_1 = require("../../application/use-cases/transactions/create-transaction.use-case");
const get_transaction_history_use_case_1 = require("../../application/use-cases/transactions/get-transaction-history.use-case");
const verify_transaction_use_case_1 = require("../../application/use-cases/transactions/verify-transaction.use-case");
const sync_offline_transactions_use_case_1 = require("../../application/use-cases/transactions/sync-offline-transactions.use-case");
let TransactionsService = class TransactionsService {
    constructor(createTransactionUseCase, getTransactionHistoryUseCase, verifyTransactionUseCase, syncOfflineTransactionsUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionHistoryUseCase = getTransactionHistoryUseCase;
        this.verifyTransactionUseCase = verifyTransactionUseCase;
        this.syncOfflineTransactionsUseCase = syncOfflineTransactionsUseCase;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [create_transaction_use_case_1.CreateTransactionUseCase,
        get_transaction_history_use_case_1.GetTransactionHistoryUseCase,
        verify_transaction_use_case_1.VerifyTransactionUseCase,
        sync_offline_transactions_use_case_1.SyncOfflineTransactionsUseCase])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map