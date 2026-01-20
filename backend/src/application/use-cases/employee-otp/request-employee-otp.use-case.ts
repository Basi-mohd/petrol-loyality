import { Injectable } from '@nestjs/common';
import { OtpService } from '../../../infrastructure/services/otp/otp.service';

export interface RequestEmployeeOtpDto {
  phoneNumber: string;
  deviceId: string;
}

export interface RequestEmployeeOtpResponse {
  otpId: string;
  expiresInMinutes: number;
}

@Injectable()
export class RequestEmployeeOtpUseCase {
  constructor(private readonly otpService: OtpService) {}

  async execute(dto: RequestEmployeeOtpDto): Promise<RequestEmployeeOtpResponse> {
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
