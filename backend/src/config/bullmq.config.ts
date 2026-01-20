import { ConfigService } from '@nestjs/config';

export const getBullMQConfig = (configService: ConfigService) => ({
  connection: {
    host: configService.get<string>('bullmq.host'),
    port: configService.get<number>('bullmq.port'),
    password: configService.get<string>('bullmq.password'),
  },
});
