import { OtpService } from '../../../infrastructure/services/otp/otp.service';
export interface RequestOtpDto {
    phoneNumber: string;
    deviceId: string;
}
export interface RequestOtpResponse {
    otpId: string;
    expiresInMinutes: number;
}
export declare class RequestOtpUseCase {
    private readonly otpService;
    constructor(otpService: OtpService);
    execute(dto: RequestOtpDto): Promise<RequestOtpResponse>;
}
