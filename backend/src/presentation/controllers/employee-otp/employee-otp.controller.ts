import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RequestEmployeeOtpUseCase } from '../../../application/use-cases/employee-otp/request-employee-otp.use-case';
import { VerifyEmployeeOtpUseCase } from '../../../application/use-cases/employee-otp/verify-employee-otp.use-case';
import { RequestOtpRequestDto } from '../../dto/otp/request-otp-request.dto';
import { VerifyOtpRequestDto } from '../../dto/otp/verify-otp-request.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('employee/otp')
export class EmployeeOtpController {
  constructor(
    private readonly requestEmployeeOtpUseCase: RequestEmployeeOtpUseCase,
    private readonly verifyEmployeeOtpUseCase: VerifyEmployeeOtpUseCase,
  ) {}

  @Post('request')
  @Public()
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpRequestDto) {
    return this.requestEmployeeOtpUseCase.execute(dto);
  }

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpRequestDto) {
    return this.verifyEmployeeOtpUseCase.execute(dto);
  }
}
