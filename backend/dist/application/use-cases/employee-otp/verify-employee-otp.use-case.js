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
exports.VerifyEmployeeOtpUseCase = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("../../../infrastructure/services/otp/otp.service");
const jwt_service_1 = require("../../../infrastructure/security/jwt/jwt.service");
const audit_service_1 = require("../../../infrastructure/audit/audit.service");
const uuid_1 = require("uuid");
const user_role_enum_1 = require("../../../domain/enums/user-role.enum");
let VerifyEmployeeOtpUseCase = class VerifyEmployeeOtpUseCase {
    constructor(otpService, jwtService, auditService) {
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }
    async execute(dto) {
        const isValid = await this.otpService.verifyOtp(dto.otpId, dto.code, dto.phoneNumber, dto.deviceId);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid OTP code');
        }
        const employeeId = (0, uuid_1.v4)();
        const employeeEmail = `employee-${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}@example.com`;
        const employeeName = `Employee ${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}`;
        try {
            await this.auditService.log(employeeId, 'STAFF', 'EMPLOYEE_LOGIN', 'EMPLOYEE', employeeId, {
                phoneNumber: dto.phoneNumber,
                deviceId: dto.deviceId.substring(0, 8) + '...',
            });
        }
        catch (err) {
            console.warn('Audit log failed, continuing');
        }
        const payload = {
            sub: employeeId,
            phoneNumber: dto.phoneNumber,
            role: user_role_enum_1.UserRole.STAFF,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.generateAccessToken(payload),
            this.jwtService.generateRefreshToken(payload),
        ]);
        return {
            accessToken,
            refreshToken,
            employee: {
                id: employeeId,
                phoneNumber: dto.phoneNumber,
                email: employeeEmail,
                name: employeeName,
            },
        };
    }
};
exports.VerifyEmployeeOtpUseCase = VerifyEmployeeOtpUseCase;
exports.VerifyEmployeeOtpUseCase = VerifyEmployeeOtpUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [otp_service_1.OtpService,
        jwt_service_1.JwtService,
        audit_service_1.AuditService])
], VerifyEmployeeOtpUseCase);
//# sourceMappingURL=verify-employee-otp.use-case.js.map