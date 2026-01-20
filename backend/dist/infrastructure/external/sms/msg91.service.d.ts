import { ConfigService } from '@nestjs/config';
import { ISmsService } from './sms.service.interface';
export declare class Msg91Service implements ISmsService {
    private readonly configService;
    private readonly logger;
    private readonly apiKey;
    private readonly senderId;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    sendSms(phoneNumber: string, message: string): Promise<void>;
    private cleanPhoneNumber;
}
