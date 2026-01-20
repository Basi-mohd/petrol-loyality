import { ConfigService } from '@nestjs/config';

export const getSmsConfig = (configService: ConfigService) => ({
  provider: configService.get<string>('sms.provider'),
  apiKey: configService.get<string>('sms.apiKey'),
  apiSecret: configService.get<string>('sms.apiSecret'),
  fromNumber: configService.get<string>('sms.fromNumber'),
});
