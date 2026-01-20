import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getBullMQConfig } from '../../../config/bullmq.config';
import { QUEUE_NAMES } from '../../../shared/constants/queue-names.constants';
import { TransactionProcessor } from './processors/transaction.processor';
import { ReconciliationProcessor } from './processors/reconciliation.processor';
import { SmsProcessor } from './processors/sms.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getBullMQConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: QUEUE_NAMES.TRANSACTION },
      { name: QUEUE_NAMES.RECONCILIATION },
      { name: QUEUE_NAMES.SMS },
    ),
  ],
  providers: [
    TransactionProcessor,
    ReconciliationProcessor,
    SmsProcessor,
  ],
  exports: [BullModule],
})
export class BullMQModule {}
