import { OtpService } from '../../../infrastructure/services/otp/otp.service';
export interface RequestEmployeeOtpDto {
    phoneNumber: string;
    deviceId: string;
}
export interface RequestEmployeeOtpResponse {
    otpId: string;
    expiresInMinutes: number;
}
export declare class RequestEmployeeOtpUseCase {
    private readonly otpService;
    constructor(otpService: OtpService);
    execute(dto: RequestEmployeeOtpDto): Promise<RequestEmployeeOtpResponse>;
}
