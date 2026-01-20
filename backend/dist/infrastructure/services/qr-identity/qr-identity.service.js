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
var QrIdentityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrIdentityService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const customer_qr_identity_entity_1 = require("../../../domain/entities/customer-qr-identity.entity");
let QrIdentityService = QrIdentityService_1 = class QrIdentityService {
    constructor(qrIdentityRepository) {
        this.qrIdentityRepository = qrIdentityRepository;
        this.logger = new common_1.Logger(QrIdentityService_1.name);
        this.qrTokenLength = 32;
    }
    async generateQrIdentity(customerId) {
        await this.qrIdentityRepository.deactivateAllForCustomer(customerId);
        const qrToken = this.generateSecureQrToken();
        const identityId = (0, uuid_1.v4)();
        const identity = customer_qr_identity_entity_1.CustomerQrIdentity.create(identityId, customerId, qrToken);
        await this.qrIdentityRepository.save(identity);
        this.logger.log(`QR identity generated for customer ${customerId}`);
        return identity;
    }
    async regenerateQrIdentity(customerId) {
        return this.generateQrIdentity(customerId);
    }
    async getQrIdentityByToken(qrToken) {
        return this.qrIdentityRepository.findByQrToken(qrToken);
    }
    async getActiveQrIdentity(customerId) {
        return this.qrIdentityRepository.findActiveByCustomerId(customerId);
    }
    generateSecureQrToken() {
        const randomBuffer = (0, crypto_1.randomBytes)(this.qrTokenLength);
        return randomBuffer.toString('base64url').substring(0, this.qrTokenLength);
    }
};
exports.QrIdentityService = QrIdentityService;
exports.QrIdentityService = QrIdentityService = QrIdentityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICustomerQrIdentityRepository')),
    __metadata("design:paramtypes", [Object])
], QrIdentityService);
//# sourceMappingURL=qr-identity.service.js.map