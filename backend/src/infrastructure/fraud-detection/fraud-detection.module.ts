import { Module } from '@nestjs/common';
import { FraudDetectionService } from './fraud-detection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../persistence/postgres/entities/transaction.orm-entity';
import { TransactionRepository } from '../persistence/postgres/repositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
  providers: [
    FraudDetectionService,
    TransactionRepository,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'IFraudDetectionService',
      useClass: FraudDetectionService,
    },
  ],
  exports: [FraudDetectionService, 'IFraudDetectionService'],
})
export class FraudDetectionModule {}
