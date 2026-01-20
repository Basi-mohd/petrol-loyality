import { ConfigService } from '@nestjs/config';
import { ISmsService } from './sms.service.interface';
export declare class SmsService implements ISmsService {
    private readonly configService;
    private readonly config;
    constructor(configService: ConfigService);
    sendSms(phoneNumber: string, message: string): Promise<void>;
    private sendViaTwilio;
}
