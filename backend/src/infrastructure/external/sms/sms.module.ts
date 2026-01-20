import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';
import { Msg91Service } from './msg91.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ISmsService',
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('sms.provider');
        if (provider === 'msg91') {
          return new Msg91Service(configService);
        }
        return new SmsService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['ISmsService'],
})
export class SmsModule {}
