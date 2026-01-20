import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RequestOtpUseCase } from '../../../application/use-cases/otp/request-otp.use-case';
import { VerifyOtpUseCase } from '../../../application/use-cases/otp/verify-otp.use-case';
import { RequestOtpRequestDto } from '../../dto/otp/request-otp-request.dto';
import { VerifyOtpRequestDto } from '../../dto/otp/verify-otp-request.dto';
import { Public } from '../../decorators/public.decorator';
import { JwtAuthGuard } from '../../../infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly requestOtpUseCase: RequestOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  @Post('request')
  @Public()
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpRequestDto) {
    return this.requestOtpUseCase.execute(dto);
  }

  @Post('verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpRequestDto) {
    return this.verifyOtpUseCase.execute(dto);
  }
}
