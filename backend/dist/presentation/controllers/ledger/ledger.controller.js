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
exports.LedgerController = void 0;
const common_1 = require("@nestjs/common");
const append_ledger_entry_use_case_1 = require("../../../application/use-cases/ledger/append-ledger-entry.use-case");
const verify_ledger_integrity_use_case_1 = require("../../../application/use-cases/ledger/verify-ledger-integrity.use-case");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../infrastructure/security/guards/roles.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const user_role_enum_1 = require("../../../domain/enums/user-role.enum");
let LedgerController = class LedgerController {
    constructor(appendLedgerEntryUseCase, verifyLedgerIntegrityUseCase) {
        this.appendLedgerEntryUseCase = appendLedgerEntryUseCase;
        this.verifyLedgerIntegrityUseCase = verifyLedgerIntegrityUseCase;
    }
    async append(transactionId) {
        await this.appendLedgerEntryUseCase.execute(transactionId);
        return { success: true };
    }
    async verifyIntegrity() {
        const isValid = await this.verifyLedgerIntegrityUseCase.execute();
        return { isValid };
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, common_1.Post)('append/:transactionId'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "append", null);
__decorate([
    (0, common_1.Get)('verify-integrity'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "verifyIntegrity", null);
exports.LedgerController = LedgerController = __decorate([
    (0, common_1.Controller)('ledger'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [append_ledger_entry_use_case_1.AppendLedgerEntryUseCase,
        verify_ledger_integrity_use_case_1.VerifyLedgerIntegrityUseCase])
], LedgerController);
//# sourceMappingURL=ledger.controller.js.map