"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ledger_controller_1 = require("../../presentation/controllers/ledger/ledger.controller");
const ledger_service_1 = require("./ledger.service");
const append_ledger_entry_use_case_1 = require("../../application/use-cases/ledger/append-ledger-entry.use-case");
const verify_ledger_integrity_use_case_1 = require("../../application/use-cases/ledger/verify-ledger-integrity.use-case");
const transaction_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/transaction.orm-entity");
const ledger_entry_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/ledger-entry.orm-entity");
const transaction_repository_1 = require("../../infrastructure/persistence/postgres/repositories/transaction.repository");
const ledger_repository_1 = require("../../infrastructure/persistence/postgres/repositories/ledger.repository");
let LedgerModule = class LedgerModule {
};
exports.LedgerModule = LedgerModule;
exports.LedgerModule = LedgerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_orm_entity_1.TransactionOrmEntity, ledger_entry_orm_entity_1.LedgerEntryOrmEntity]),
        ],
        controllers: [ledger_controller_1.LedgerController],
        providers: [
            ledger_service_1.LedgerService,
            append_ledger_entry_use_case_1.AppendLedgerEntryUseCase,
            verify_ledger_integrity_use_case_1.VerifyLedgerIntegrityUseCase,
            {
                provide: 'ITransactionRepository',
                useClass: transaction_repository_1.TransactionRepository,
            },
            {
                provide: 'ILedgerRepository',
                useClass: ledger_repository_1.LedgerRepository,
            },
        ],
        exports: [ledger_service_1.LedgerService],
    })
], LedgerModule);
//# sourceMappingURL=ledger.module.js.map