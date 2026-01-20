"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionModule = void 0;
const common_1 = require("@nestjs/common");
const fraud_detection_service_1 = require("./fraud-detection.service");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_orm_entity_1 = require("../persistence/postgres/entities/transaction.orm-entity");
const transaction_repository_1 = require("../persistence/postgres/repositories/transaction.repository");
let FraudDetectionModule = class FraudDetectionModule {
};
exports.FraudDetectionModule = FraudDetectionModule;
exports.FraudDetectionModule = FraudDetectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transaction_orm_entity_1.TransactionOrmEntity])],
        providers: [
            fraud_detection_service_1.FraudDetectionService,
            transaction_repository_1.TransactionRepository,
            {
                provide: 'ITransactionRepository',
                useClass: transaction_repository_1.TransactionRepository,
            },
            {
                provide: 'IFraudDetectionService',
                useClass: fraud_detection_service_1.FraudDetectionService,
            },
        ],
        exports: [fraud_detection_service_1.FraudDetectionService, 'IFraudDetectionService'],
    })
], FraudDetectionModule);
//# sourceMappingURL=fraud-detection.module.js.map