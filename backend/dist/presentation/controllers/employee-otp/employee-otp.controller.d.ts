import { RequestEmployeeOtpUseCase } from '../../../application/use-cases/employee-otp/request-employee-otp.use-case';
import { VerifyEmployeeOtpUseCase } from '../../../application/use-cases/employee-otp/verify-employee-otp.use-case';
import { RequestOtpRequestDto } from '../../dto/otp/request-otp-request.dto';
import { VerifyOtpRequestDto } from '../../dto/otp/verify-otp-request.dto';
export declare class EmployeeOtpController {
    private readonly requestEmployeeOtpUseCase;
    private readonly verifyEmployeeOtpUseCase;
    constructor(requestEmployeeOtpUseCase: RequestEmployeeOtpUseCase, verifyEmployeeOtpUseCase: VerifyEmployeeOtpUseCase);
    requestOtp(dto: RequestOtpRequestDto): Promise<import("../../../application/use-cases/employee-otp/request-employee-otp.use-case").RequestEmployeeOtpResponse>;
    verifyOtp(dto: VerifyOtpRequestDto): Promise<import("../../../application/use-cases/employee-otp/verify-employee-otp.use-case").VerifyEmployeeOtpResponse>;
}
