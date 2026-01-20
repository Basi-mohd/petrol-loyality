import { OtpService } from '../../../infrastructure/services/otp/otp.service';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { QrIdentityService } from '../../../infrastructure/services/qr-identity/qr-identity.service';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
export interface VerifyOtpDto {
    otpId: string;
    code: string;
    phoneNumber: string;
    deviceId: string;
}
export interface VerifyOtpResponse {
    accessToken: string;
    refreshToken: string;
    customer: {
        id: string;
        phoneNumber: string;
        qrToken: string;
    };
    isNewCustomer: boolean;
}
export declare class VerifyOtpUseCase {
    private readonly otpService;
    private readonly customerRepository;
    private readonly qrIdentityService;
    private readonly jwtService;
    private readonly auditService;
    private readonly logger;
    constructor(otpService: OtpService, customerRepository: ICustomerRepository, qrIdentityService: QrIdentityService, jwtService: JwtService, auditService: AuditService);
    execute(dto: VerifyOtpDto): Promise<VerifyOtpResponse>;
}
