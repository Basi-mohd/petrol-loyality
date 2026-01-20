import { ConfigService } from '@nestjs/config';
export declare const getSmsConfig: (configService: ConfigService) => {
    provider: string;
    apiKey: string;
    apiSecret: string;
    fromNumber: string;
};
