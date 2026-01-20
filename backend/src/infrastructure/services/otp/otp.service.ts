import { Injectable, Logger, BadRequestException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Otp } from '../../../domain/entities/otp.entity';
import { IOtpRepository } from '../../persistence/postgres/repositories/otp.repository';
import { IDeviceBindingRepository } from '../../persistence/postgres/repositories/device-binding.repository';
import { ISmsService } from '../../external/sms/sms.service.interface';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpExpiryMinutes: number;
  private readonly maxAttempts: number;
  private readonly rateLimitMinutes: number;
  private readonly maxRequestsPerWindow: number;

  constructor(
    @Inject('IOtpRepository')
    private readonly otpRepository: IOtpRepository,
    @Inject('IDeviceBindingRepository')
    private readonly deviceBindingRepository: IDeviceBindingRepository,
    @Inject('ISmsService')
    private readonly smsService: ISmsService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {
    this.otpExpiryMinutes = parseInt(
      this.configService.get<string>('otp.expiryMinutes') || '2',
      10,
    );
    this.maxAttempts = parseInt(
      this.configService.get<string>('otp.maxAttempts') || '5',
      10,
    );
    this.rateLimitMinutes = parseInt(
      this.configService.get<string>('otp.rateLimitMinutes') || '5',
      10,
    );
    this.maxRequestsPerWindow = parseInt(
      this.configService.get<string>('otp.maxRequestsPerWindow') || '3',
      10,
    );
  }

  async generateOtp(phoneNumber: string, deviceId: string): Promise<string> {
    await this.checkRateLimit(phoneNumber, deviceId);

    const code = '123456';
    const otpId = uuidv4();
    
    const otp = Otp.create(
      otpId,
      phoneNumber,
      code,
      deviceId,
      this.otpExpiryMinutes,
    );

    await this.otpRepository.save(otp);
    await this.deviceBindingRepository.save(phoneNumber, deviceId);

    this.logger.log(`[TEST MODE] OTP for ${phoneNumber}: ${code} (otpId: ${otpId})`);
    
    // const message = `Your OTP for Petrol Loyalty Wallet is ${code}. Valid for ${this.otpExpiryMinutes} minutes.`;
    // await this.smsService.sendSms(phoneNumber, message).catch((err) => {
    //   this.logger.warn(`[TEST MODE] SMS send skipped: ${err.message}`);
    // });

    await this.auditService.log(
      'system',
      'SYSTEM',
      'OTP_REQUESTED',
      'OTP',
      otpId,
      {
        phoneNumber,
        deviceId: deviceId.substring(0, 8) + '...',
      },
    ).catch(() => {});

    this.logger.log(`OTP generated for ${phoneNumber} (device: ${deviceId.substring(0, 8)}...)`);

    return otpId;
  }

  async verifyOtp(
    otpId: string,
    code: string,
    phoneNumber: string,
    deviceId: string,
  ): Promise<boolean> {
    const otp = await this.otpRepository.findById(otpId);

    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otp.phoneNumber !== phoneNumber) {
      throw new BadRequestException('OTP phone number mismatch');
    }

    if (otp.deviceId !== deviceId) {
      throw new BadRequestException('Device mismatch');
    }

    if (otp.isExpired()) {
      throw new BadRequestException('OTP has expired');
    }

    if (otp.isVerified) {
      throw new BadRequestException('OTP already verified');
    }

    if (!otp.canAttempt()) {
      throw new BadRequestException('Maximum attempts exceeded');
    }

    const updatedOtp = otp.incrementAttempts();
    await this.otpRepository.save(updatedOtp);

    if (updatedOtp.code !== code) {
      try {
        await this.auditService.log(
          'system',
          'SYSTEM',
          'OTP_VERIFICATION_FAILED',
          'OTP',
          otpId,
          {
            phoneNumber,
            deviceId: deviceId.substring(0, 8) + '...',
            attempts: updatedOtp.attempts,
          },
        );
      } catch (err) {
        this.logger.warn('Audit log failed, continuing');
      }
      this.logger.warn(`Failed OTP attempt for ${phoneNumber} (attempts: ${updatedOtp.attempts})`);
      return false;
    }

    const verifiedOtp = updatedOtp.verify();
    await this.otpRepository.save(verifiedOtp);

    try {
      await this.auditService.log(
        'system',
        'SYSTEM',
        'OTP_VERIFIED',
        'OTP',
        otpId,
        {
          phoneNumber,
          deviceId: deviceId.substring(0, 8) + '...',
        },
      );
    } catch (err) {
      this.logger.warn('Audit log failed, continuing');
    }

    this.logger.log(`OTP verified successfully for ${phoneNumber}`);
    return true;
  }

  private async checkRateLimit(phoneNumber: string, deviceId: string): Promise<void> {
    const recentOtps = await this.otpRepository.findRecentByPhone(
      phoneNumber,
      this.rateLimitMinutes,
    );

    const recentCount = recentOtps.filter(
      (otp) => otp.deviceId === deviceId && !otp.isVerified,
    ).length;

    if (recentCount >= this.maxRequestsPerWindow) {
      this.logger.warn(
        `Rate limit exceeded for ${phoneNumber} (device: ${deviceId.substring(0, 8)}...)`,
      );
      throw new HttpException(
        `Too many OTP requests. Please wait ${this.rateLimitMinutes} minutes.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private generateCryptographicOtp(): string {
    const randomBuffer = randomBytes(3);
    const randomNumber = randomBuffer.readUIntBE(0, 3);
    const otp = (randomNumber % 900000) + 100000;
    return otp.toString();
  }
}
