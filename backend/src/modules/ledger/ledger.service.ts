import { Injectable } from '@nestjs/common';
import { AppendLedgerEntryUseCase } from '../../application/use-cases/ledger/append-ledger-entry.use-case';
import { VerifyLedgerIntegrityUseCase } from '../../application/use-cases/ledger/verify-ledger-integrity.use-case';

@Injectable()
export class LedgerService {
  constructor(
    private readonly appendLedgerEntryUseCase: AppendLedgerEntryUseCase,
    private readonly verifyLedgerIntegrityUseCase: VerifyLedgerIntegrityUseCase,
  ) {}
}
