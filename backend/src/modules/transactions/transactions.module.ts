import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from '../../presentation/controllers/transactions/transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionUseCase } from '../../application/use-cases/transactions/create-transaction.use-case';
import { GetTransactionHistoryUseCase } from '../../application/use-cases/transactions/get-transaction-history.use-case';
import { VerifyTransactionUseCase } from '../../application/use-cases/transactions/verify-transaction.use-case';
import { SyncOfflineTransactionsUseCase } from '../../application/use-cases/transactions/sync-offline-transactions.use-case';
import { TransactionOrmEntity } from '../../infrastructure/persistence/postgres/entities/transaction.orm-entity';
import { LedgerEntryOrmEntity } from '../../infrastructure/persistence/postgres/entities/ledger-entry.orm-entity';
import { CustomerOrmEntity } from '../../infrastructure/persistence/postgres/entities/customer.orm-entity';
import { TransactionRepository } from '../../infrastructure/persistence/postgres/repositories/transaction.repository';
import { LedgerRepository } from '../../infrastructure/persistence/postgres/repositories/ledger.repository';
import { CustomerRepository } from '../../infrastructure/persistence/postgres/repositories/customer.repository';
import { FraudDetectionModule } from '../../infrastructure/fraud-detection/fraud-detection.module';
import { CryptographyModule } from '../../infrastructure/external/cryptography/cryptography.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionOrmEntity,
      LedgerEntryOrmEntity,
      CustomerOrmEntity,
    ]),
    FraudDetectionModule,
    CryptographyModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    CreateTransactionUseCase,
    GetTransactionHistoryUseCase,
    VerifyTransactionUseCase,
    SyncOfflineTransactionsUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'ILedgerRepository',
      useClass: LedgerRepository,
    },
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
