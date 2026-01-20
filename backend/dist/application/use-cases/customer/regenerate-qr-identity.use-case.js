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
exports.RegenerateQrIdentityUseCase = void 0;
const common_1 = require("@nestjs/common");
const qr_identity_service_1 = require("../../../infrastructure/services/qr-identity/qr-identity.service");
let RegenerateQrIdentityUseCase = class RegenerateQrIdentityUseCase {
    constructor(qrIdentityService) {
        this.qrIdentityService = qrIdentityService;
    }
    async execute(dto, authenticatedCustomerId) {
        if (dto.customerId !== authenticatedCustomerId) {
            throw new common_1.UnauthorizedException('Unauthorized to regenerate QR for this customer');
        }
        const qrIdentity = await this.qrIdentityService.regenerateQrIdentity(dto.customerId);
        return {
            qrToken: qrIdentity.qrToken,
        };
    }
};
exports.RegenerateQrIdentityUseCase = RegenerateQrIdentityUseCase;
exports.RegenerateQrIdentityUseCase = RegenerateQrIdentityUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [qr_identity_service_1.QrIdentityService])
], RegenerateQrIdentityUseCase);
//# sourceMappingURL=regenerate-qr-identity.use-case.js.map