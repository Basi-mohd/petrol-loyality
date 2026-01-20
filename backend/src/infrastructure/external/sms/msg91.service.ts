import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ISmsService } from './sms.service.interface';

@Injectable()
export class Msg91Service implements ISmsService {
  private readonly logger = new Logger(Msg91Service.name);
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly baseUrl = 'https://api.msg91.com/api/v2/sendsms';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('sms.msg91.apiKey') || '';
    this.senderId = this.configService.get<string>('sms.msg91.senderId') || 'PETROL';
  }

  async sendSms(phoneNumber: string, message: string): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn('MSG91 API key not configured, skipping SMS');
      return;
    }

    try {
      const cleanedPhone = this.cleanPhoneNumber(phoneNumber);
      const payload = {
        sender: this.senderId,
        route: '4',
        country: '91',
        sms: [
          {
            message,
            to: [cleanedPhone],
          },
        ],
      };

      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authkey: this.apiKey,
        },
        timeout: 10000,
      });

      if (response.data && response.data.type === 'success') {
        this.logger.log(`SMS sent successfully to ${cleanedPhone}`);
      } else {
        this.logger.error(`MSG91 API error: ${JSON.stringify(response.data)}`);
        throw new Error(
          `Failed to send SMS: ${
            (response.data && response.data.message) || 'Unknown error'
          }`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${phoneNumber}: ${error.message}`);
      if (axios.isAxiosError(error)) {
        throw new Error(`SMS service error: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  private cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }
}
