"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transactions_controller_1 = require("../../presentation/controllers/transactions/transactions.controller");
const transactions_service_1 = require("./transactions.service");
const create_transaction_use_case_1 = require("../../application/use-cases/transactions/create-transaction.use-case");
const get_transaction_history_use_case_1 = require("../../application/use-cases/transactions/get-transaction-history.use-case");
const verify_transaction_use_case_1 = require("../../application/use-cases/transactions/verify-transaction.use-case");
const sync_offline_transactions_use_case_1 = require("../../application/use-cases/transactions/sync-offline-transactions.use-case");
const transaction_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/transaction.orm-entity");
const ledger_entry_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/ledger-entry.orm-entity");
const customer_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/customer.orm-entity");
const transaction_repository_1 = require("../../infrastructure/persistence/postgres/repositories/transaction.repository");
const ledger_repository_1 = require("../../infrastructure/persistence/postgres/repositories/ledger.repository");
const customer_repository_1 = require("../../infrastructure/persistence/postgres/repositories/customer.repository");
const fraud_detection_module_1 = require("../../infrastructure/fraud-detection/fraud-detection.module");
const cryptography_module_1 = require("../../infrastructure/external/cryptography/cryptography.module");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                transaction_orm_entity_1.TransactionOrmEntity,
                ledger_entry_orm_entity_1.LedgerEntryOrmEntity,
                customer_orm_entity_1.CustomerOrmEntity,
            ]),
            fraud_detection_module_1.FraudDetectionModule,
            cryptography_module_1.CryptographyModule,
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            transactions_service_1.TransactionsService,
            create_transaction_use_case_1.CreateTransactionUseCase,
            get_transaction_history_use_case_1.GetTransactionHistoryUseCase,
            verify_transaction_use_case_1.VerifyTransactionUseCase,
            sync_offline_transactions_use_case_1.SyncOfflineTransactionsUseCase,
            {
                provide: 'ITransactionRepository',
                useClass: transaction_repository_1.TransactionRepository,
            },
            {
                provide: 'ILedgerRepository',
                useClass: ledger_repository_1.LedgerRepository,
            },
            {
                provide: 'ICustomerRepository',
                useClass: customer_repository_1.CustomerRepository,
            },
        ],
        exports: [transactions_service_1.TransactionsService],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map