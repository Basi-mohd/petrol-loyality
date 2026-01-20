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
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const uuid_1 = require("uuid");
const otp_entity_1 = require("../../../domain/entities/otp.entity");
const audit_service_1 = require("../../audit/audit.service");
let OtpService = OtpService_1 = class OtpService {
    constructor(otpRepository, deviceBindingRepository, smsService, configService, auditService) {
        this.otpRepository = otpRepository;
        this.deviceBindingRepository = deviceBindingRepository;
        this.smsService = smsService;
        this.configService = configService;
        this.auditService = auditService;
        this.logger = new common_1.Logger(OtpService_1.name);
        this.otpExpiryMinutes = parseInt(this.configService.get('otp.expiryMinutes') || '2', 10);
        this.maxAttempts = parseInt(this.configService.get('otp.maxAttempts') || '5', 10);
        this.rateLimitMinutes = parseInt(this.configService.get('otp.rateLimitMinutes') || '5', 10);
        this.maxRequestsPerWindow = parseInt(this.configService.get('otp.maxRequestsPerWindow') || '3', 10);
    }
    async generateOtp(phoneNumber, deviceId) {
        await this.checkRateLimit(phoneNumber, deviceId);
        const code = '123456';
        const otpId = (0, uuid_1.v4)();
        const otp = otp_entity_1.Otp.create(otpId, phoneNumber, code, deviceId, this.otpExpiryMinutes);
        await this.otpRepository.save(otp);
        await this.deviceBindingRepository.save(phoneNumber, deviceId);
        this.logger.log(`[TEST MODE] OTP for ${phoneNumber}: ${code} (otpId: ${otpId})`);
        await this.auditService.log('system', 'SYSTEM', 'OTP_REQUESTED', 'OTP', otpId, {
            phoneNumber,
            deviceId: deviceId.substring(0, 8) + '...',
        }).catch(() => { });
        this.logger.log(`OTP generated for ${phoneNumber} (device: ${deviceId.substring(0, 8)}...)`);
        return otpId;
    }
    async verifyOtp(otpId, code, phoneNumber, deviceId) {
        const otp = await this.otpRepository.findById(otpId);
        if (!otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (otp.phoneNumber !== phoneNumber) {
            throw new common_1.BadRequestException('OTP phone number mismatch');
        }
        if (otp.deviceId !== deviceId) {
            throw new common_1.BadRequestException('Device mismatch');
        }
        if (otp.isExpired()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        if (otp.isVerified) {
            throw new common_1.BadRequestException('OTP already verified');
        }
        if (!otp.canAttempt()) {
            throw new common_1.BadRequestException('Maximum attempts exceeded');
        }
        const updatedOtp = otp.incrementAttempts();
        await this.otpRepository.save(updatedOtp);
        if (updatedOtp.code !== code) {
            try {
                await this.auditService.log('system', 'SYSTEM', 'OTP_VERIFICATION_FAILED', 'OTP', otpId, {
                    phoneNumber,
                    deviceId: deviceId.substring(0, 8) + '...',
                    attempts: updatedOtp.attempts,
                });
            }
            catch (err) {
                this.logger.warn('Audit log failed, continuing');
            }
            this.logger.warn(`Failed OTP attempt for ${phoneNumber} (attempts: ${updatedOtp.attempts})`);
            return false;
        }
        const verifiedOtp = updatedOtp.verify();
        await this.otpRepository.save(verifiedOtp);
        try {
            await this.auditService.log('system', 'SYSTEM', 'OTP_VERIFIED', 'OTP', otpId, {
                phoneNumber,
                deviceId: deviceId.substring(0, 8) + '...',
            });
        }
        catch (err) {
            this.logger.warn('Audit log failed, continuing');
        }
        this.logger.log(`OTP verified successfully for ${phoneNumber}`);
        return true;
    }
    async checkRateLimit(phoneNumber, deviceId) {
        const recentOtps = await this.otpRepository.findRecentByPhone(phoneNumber, this.rateLimitMinutes);
        const recentCount = recentOtps.filter((otp) => otp.deviceId === deviceId && !otp.isVerified).length;
        if (recentCount >= this.maxRequestsPerWindow) {
            this.logger.warn(`Rate limit exceeded for ${phoneNumber} (device: ${deviceId.substring(0, 8)}...)`);
            throw new common_1.HttpException(`Too many OTP requests. Please wait ${this.rateLimitMinutes} minutes.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    generateCryptographicOtp() {
        const randomBuffer = (0, crypto_1.randomBytes)(3);
        const randomNumber = randomBuffer.readUIntBE(0, 3);
        const otp = (randomNumber % 900000) + 100000;
        return otp.toString();
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IOtpRepository')),
    __param(1, (0, common_1.Inject)('IDeviceBindingRepository')),
    __param(2, (0, common_1.Inject)('ISmsService')),
    __metadata("design:paramtypes", [Object, Object, Object, config_1.ConfigService,
        audit_service_1.AuditService])
], OtpService);
//# sourceMappingURL=otp.service.js.map