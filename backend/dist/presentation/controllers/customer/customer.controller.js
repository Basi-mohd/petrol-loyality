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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const regenerate_qr_identity_use_case_1 = require("../../../application/use-cases/customer/regenerate-qr-identity.use-case");
const jwt_auth_guard_1 = require("../../../infrastructure/security/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../decorators/current-user.decorator");
const qr_identity_service_1 = require("../../../infrastructure/services/qr-identity/qr-identity.service");
let CustomerController = class CustomerController {
    constructor(regenerateQrIdentityUseCase, qrIdentityService, customerRepository) {
        this.regenerateQrIdentityUseCase = regenerateQrIdentityUseCase;
        this.qrIdentityService = qrIdentityService;
        this.customerRepository = customerRepository;
    }
    async resolveQrToken(qrToken) {
        const qrIdentity = await this.qrIdentityService.getQrIdentityByToken(qrToken);
        if (!qrIdentity || !qrIdentity.isActive || qrIdentity.isExpired()) {
            throw new common_1.BadRequestException('Invalid or inactive QR token');
        }
        return {
            customerId: qrIdentity.customerId,
            qrToken: qrIdentity.qrToken,
        };
    }
    async regenerateQrIdentity(customerId, user) {
        return this.regenerateQrIdentityUseCase.execute({ customerId }, user.userId || user.sub);
    }
    async getQrIdentity(user) {
        const customerId = user.userId || user.sub;
        const qrIdentity = await this.qrIdentityService.getActiveQrIdentity(customerId);
        if (!qrIdentity) {
            throw new common_1.BadRequestException('QR identity not found');
        }
        return {
            qrToken: qrIdentity.qrToken,
            customerId: qrIdentity.customerId,
        };
    }
    async getBalance(user) {
        const customerId = user.userId || user.sub;
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            throw new common_1.BadRequestException('Customer not found');
        }
        return {
            balance: customer.balance.getValue(),
            customerId: customer.id,
            name: customer.name,
        };
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)('qr/resolve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('qrToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "resolveQrToken", null);
__decorate([
    (0, common_1.Post)('qr/regenerate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('customerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "regenerateQrIdentity", null);
__decorate([
    (0, common_1.Get)('qr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getQrIdentity", null);
__decorate([
    (0, common_1.Get)('balance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getBalance", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('customer'),
    __param(2, (0, common_1.Inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [regenerate_qr_identity_use_case_1.RegenerateQrIdentityUseCase,
        qr_identity_service_1.QrIdentityService, Object])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map