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
var VerifyOtpUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpUseCase = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("../../../infrastructure/services/otp/otp.service");
const phone_number_vo_1 = require("../../../domain/value-objects/phone-number.vo");
const amount_vo_1 = require("../../../domain/value-objects/amount.vo");
const customer_entity_1 = require("../../../domain/entities/customer.entity");
const qr_identity_service_1 = require("../../../infrastructure/services/qr-identity/qr-identity.service");
const jwt_service_1 = require("../../../infrastructure/security/jwt/jwt.service");
const audit_service_1 = require("../../../infrastructure/audit/audit.service");
const uuid_1 = require("uuid");
let VerifyOtpUseCase = VerifyOtpUseCase_1 = class VerifyOtpUseCase {
    constructor(otpService, customerRepository, qrIdentityService, jwtService, auditService) {
        this.otpService = otpService;
        this.customerRepository = customerRepository;
        this.qrIdentityService = qrIdentityService;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.logger = new common_1.Logger(VerifyOtpUseCase_1.name);
    }
    async execute(dto) {
        try {
            const isValid = await this.otpService.verifyOtp(dto.otpId, dto.code, dto.phoneNumber, dto.deviceId);
            if (!isValid) {
                throw new common_1.BadRequestException('Invalid OTP code');
            }
            let customer = await this.customerRepository.findByPhoneNumber(phone_number_vo_1.PhoneNumber.create(dto.phoneNumber));
            let isNewCustomer = false;
            if (!customer) {
                customer = customer_entity_1.Customer.create((0, uuid_1.v4)(), phone_number_vo_1.PhoneNumber.create(dto.phoneNumber), `Customer ${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}`, amount_vo_1.Amount.create(0));
                await this.customerRepository.save(customer);
                isNewCustomer = true;
                await this.auditService.log(customer.id, 'CUSTOMER', 'CUSTOMER_CREATED', 'CUSTOMER', customer.id, {
                    phoneNumber: dto.phoneNumber,
                    deviceId: dto.deviceId.substring(0, 8) + '...',
                });
            }
            let qrIdentity = await this.qrIdentityService.getActiveQrIdentity(customer.id);
            if (!qrIdentity) {
                qrIdentity = await this.qrIdentityService.generateQrIdentity(customer.id);
                await this.auditService.log(customer.id, 'CUSTOMER', 'QR_IDENTITY_GENERATED', 'QR_IDENTITY', qrIdentity.id, {
                    customerId: customer.id,
                    qrToken: qrIdentity.qrToken.substring(0, 8) + '...',
                });
            }
            const payload = {
                sub: customer.id,
                phoneNumber: customer.phoneNumber.getCleaned(),
                role: 'CUSTOMER',
            };
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.generateAccessToken(payload),
                this.jwtService.generateRefreshToken(payload),
            ]);
            return {
                accessToken,
                refreshToken,
                customer: {
                    id: customer.id,
                    phoneNumber: customer.phoneNumber.getCleaned(),
                    qrToken: qrIdentity.qrToken,
                },
                isNewCustomer,
            };
        }
        catch (error) {
            this.logger.error(`Error in verify OTP: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.VerifyOtpUseCase = VerifyOtpUseCase;
exports.VerifyOtpUseCase = VerifyOtpUseCase = VerifyOtpUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('ICustomerRepository')),
    __metadata("design:paramtypes", [otp_service_1.OtpService, Object, qr_identity_service_1.QrIdentityService,
        jwt_service_1.JwtService,
        audit_service_1.AuditService])
], VerifyOtpUseCase);
//# sourceMappingURL=verify-otp.use-case.js.map