import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISmsService } from './sms.service.interface';
import { getSmsConfig } from '../../../config/sms.config';

@Injectable()
export class SmsService implements ISmsService {
  private readonly config: ReturnType<typeof getSmsConfig>;

  constructor(private readonly configService: ConfigService) {
    this.config = getSmsConfig(configService);
  }

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    if (this.config.provider === 'twilio') {
      await this.sendViaTwilio(phoneNumber, message);
    } else {
      console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);
    }
  }

  private async sendViaTwilio(phoneNumber: string, message: string): Promise<void> {
    const accountSid = this.config.apiKey;
    const authToken = this.config.apiSecret;

    if (!accountSid || !authToken) {
      console.warn('[SMS] Twilio credentials not configured, skipping SMS');
      return;
    }

    console.log(`[SMS Twilio] To: ${phoneNumber}, Message: ${message}`);
  }
}
