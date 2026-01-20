import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { getBullMQConfig } from '../../../../config/bullmq.config';
import { QUEUE_NAMES } from '../../../../shared/constants/queue-names.constants';

export const createSmsQueue = (configService: ConfigService): Queue => {
  const config = getBullMQConfig(configService);
  return new Queue(QUEUE_NAMES.SMS, {
    connection: config.connection,
  });
};
