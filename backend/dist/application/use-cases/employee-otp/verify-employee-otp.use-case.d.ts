import { OtpService } from '../../../infrastructure/services/otp/otp.service';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
export interface VerifyEmployeeOtpDto {
    otpId: string;
    code: string;
    phoneNumber: string;
    deviceId: string;
}
export interface VerifyEmployeeOtpResponse {
    accessToken: string;
    refreshToken: string;
    employee: {
        id: string;
        phoneNumber: string;
        email?: string;
        name?: string;
    };
}
export declare class VerifyEmployeeOtpUseCase {
    private readonly otpService;
    private readonly jwtService;
    private readonly auditService;
    constructor(otpService: OtpService, jwtService: JwtService, auditService: AuditService);
    execute(dto: VerifyEmployeeOtpDto): Promise<VerifyEmployeeOtpResponse>;
}
