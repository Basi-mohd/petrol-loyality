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
var TransactionsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const create_transaction_use_case_1 = require("../../../application/use-cases/transactions/create-transaction.use-case");
const get_transaction_history_use_case_1 = require("../../../application/use-cases/transactions/get-transaction-history.use-case");
const verify_transaction_use_case_1 = require("../../../application/use-cases/transactions/verify-transaction.use-case");
const sync_offline_transactions_use_case_1 = require("../../../application/use-cases/transactions/sync-offline-transactions.use-case");
const create_transaction_request_dto_1 = require("../../dto/transactions/create-transaction-request.dto");
const offline_sync_dto_1 = require("../../../application/dto/sync/offline-sync.dto");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../infrastructure/security/guards/roles.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const user_role_enum_1 = require("../../../domain/enums/user-role.enum");
const invalid_signature_exception_1 = require("../../../domain/exceptions/invalid-signature.exception");
const insufficient_balance_exception_1 = require("../../../domain/exceptions/insufficient-balance.exception");
let TransactionsController = TransactionsController_1 = class TransactionsController {
    constructor(createTransactionUseCase, getTransactionHistoryUseCase, verifyTransactionUseCase, syncOfflineTransactionsUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
        this.getTransactionHistoryUseCase = getTransactionHistoryUseCase;
        this.verifyTransactionUseCase = verifyTransactionUseCase;
        this.syncOfflineTransactionsUseCase = syncOfflineTransactionsUseCase;
        this.logger = new common_1.Logger(TransactionsController_1.name);
    }
    async create(dto) {
        try {
            return await this.createTransactionUseCase.execute(dto);
        }
        catch (error) {
            this.logger.error(`Error creating transaction: ${error.message}`, error.stack);
            if (error instanceof invalid_signature_exception_1.InvalidSignatureException) {
                throw new common_1.BadRequestException('Invalid transaction signature');
            }
            if (error instanceof insufficient_balance_exception_1.InsufficientBalanceException) {
                throw new common_1.BadRequestException(error.message);
            }
            if (error.message?.includes('Customer not found')) {
                throw new common_1.BadRequestException('Customer not found');
            }
            if (error.message?.includes('Fraud detected')) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.InternalServerErrorException(error.message || 'Failed to create transaction');
        }
    }
    async getHistory(customerId) {
        return this.getTransactionHistoryUseCase.execute(customerId);
    }
    async verify(transactionId) {
        return this.verifyTransactionUseCase.execute(transactionId);
    }
    async sync(dto) {
        return this.syncOfflineTransactionsUseCase.execute(dto);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.STAFF, user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_request_dto_1.CreateTransactionRequestDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('history/:customerId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CUSTOMER, user_role_enum_1.UserRole.STAFF, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('verify/:transactionId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.STAFF, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CUSTOMER, user_role_enum_1.UserRole.STAFF, user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [offline_sync_dto_1.OfflineSyncDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "sync", null);
exports.TransactionsController = TransactionsController = TransactionsController_1 = __decorate([
    (0, common_1.Controller)('transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [create_transaction_use_case_1.CreateTransactionUseCase,
        get_transaction_history_use_case_1.GetTransactionHistoryUseCase,
        verify_transaction_use_case_1.VerifyTransactionUseCase,
        sync_offline_transactions_use_case_1.SyncOfflineTransactionsUseCase])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map