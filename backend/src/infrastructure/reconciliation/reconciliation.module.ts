import { Module } from '@nestjs/common';
import { ReconciliationService } from './reconciliation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from '../persistence/postgres/entities/transaction.orm-entity';
import { LedgerEntryOrmEntity } from '../persistence/postgres/entities/ledger-entry.orm-entity';
import { TransactionRepository } from '../persistence/postgres/repositories/transaction.repository';
import { LedgerRepository } from '../persistence/postgres/repositories/ledger.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity, LedgerEntryOrmEntity]),
  ],
  providers: [
    ReconciliationService,
    TransactionRepository,
    LedgerRepository,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'ILedgerRepository',
      useClass: LedgerRepository,
    },
    {
      provide: 'IReconciliationService',
      useClass: ReconciliationService,
    },
  ],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
