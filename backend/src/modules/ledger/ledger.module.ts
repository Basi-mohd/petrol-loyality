import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerController } from '../../presentation/controllers/ledger/ledger.controller';
import { LedgerService } from './ledger.service';
import { AppendLedgerEntryUseCase } from '../../application/use-cases/ledger/append-ledger-entry.use-case';
import { VerifyLedgerIntegrityUseCase } from '../../application/use-cases/ledger/verify-ledger-integrity.use-case';
import { TransactionOrmEntity } from '../../infrastructure/persistence/postgres/entities/transaction.orm-entity';
import { LedgerEntryOrmEntity } from '../../infrastructure/persistence/postgres/entities/ledger-entry.orm-entity';
import { TransactionRepository } from '../../infrastructure/persistence/postgres/repositories/transaction.repository';
import { LedgerRepository } from '../../infrastructure/persistence/postgres/repositories/ledger.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity, LedgerEntryOrmEntity]),
  ],
  controllers: [LedgerController],
  providers: [
    LedgerService,
    AppendLedgerEntryUseCase,
    VerifyLedgerIntegrityUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'ILedgerRepository',
      useClass: LedgerRepository,
    },
  ],
  exports: [LedgerService],
})
export class LedgerModule {}
