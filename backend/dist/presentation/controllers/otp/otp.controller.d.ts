import { RequestOtpUseCase } from '../../../application/use-cases/otp/request-otp.use-case';
import { VerifyOtpUseCase } from '../../../application/use-cases/otp/verify-otp.use-case';
import { RequestOtpRequestDto } from '../../dto/otp/request-otp-request.dto';
import { VerifyOtpRequestDto } from '../../dto/otp/verify-otp-request.dto';
export declare class OtpController {
    private readonly requestOtpUseCase;
    private readonly verifyOtpUseCase;
    constructor(requestOtpUseCase: RequestOtpUseCase, verifyOtpUseCase: VerifyOtpUseCase);
    requestOtp(dto: RequestOtpRequestDto): Promise<import("../../../application/use-cases/otp/request-otp.use-case").RequestOtpResponse>;
    verifyOtp(dto: VerifyOtpRequestDto): Promise<import("../../../application/use-cases/otp/verify-otp.use-case").VerifyOtpResponse>;
}
