import { ConfigService } from '@nestjs/config';
import { IOtpRepository } from '../../persistence/postgres/repositories/otp.repository';
import { IDeviceBindingRepository } from '../../persistence/postgres/repositories/device-binding.repository';
import { ISmsService } from '../../external/sms/sms.service.interface';
import { AuditService } from '../../audit/audit.service';
export declare class OtpService {
    private readonly otpRepository;
    private readonly deviceBindingRepository;
    private readonly smsService;
    private readonly configService;
    private readonly auditService;
    private readonly logger;
    private readonly otpExpiryMinutes;
    private readonly maxAttempts;
    private readonly rateLimitMinutes;
    private readonly maxRequestsPerWindow;
    constructor(otpRepository: IOtpRepository, deviceBindingRepository: IDeviceBindingRepository, smsService: ISmsService, configService: ConfigService, auditService: AuditService);
    generateOtp(phoneNumber: string, deviceId: string): Promise<string>;
    verifyOtp(otpId: string, code: string, phoneNumber: string, deviceId: string): Promise<boolean>;
    private checkRateLimit;
    private generateCryptographicOtp;
}
