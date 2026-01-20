import { Injectable } from '@nestjs/common';
import { OtpService } from '../../../infrastructure/services/otp/otp.service';

export interface RequestOtpDto {
  phoneNumber: string;
  deviceId: string;
}

export interface RequestOtpResponse {
  otpId: string;
  expiresInMinutes: number;
}

@Injectable()
export class RequestOtpUseCase {
  constructor(private readonly otpService: OtpService) {}

  async execute(dto: RequestOtpDto): Promise<RequestOtpResponse> {
    const otpId = await this.otpService.generateOtp(
      dto.phoneNumber,
      dto.deviceId,
    );

    return {
      otpId,
      expiresInMinutes: 2,
    };
  }
}
