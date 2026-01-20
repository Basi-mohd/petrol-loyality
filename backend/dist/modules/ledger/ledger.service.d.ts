import { AppendLedgerEntryUseCase } from '../../application/use-cases/ledger/append-ledger-entry.use-case';
import { VerifyLedgerIntegrityUseCase } from '../../application/use-cases/ledger/verify-ledger-integrity.use-case';
export declare class LedgerService {
    private readonly appendLedgerEntryUseCase;
    private readonly verifyLedgerIntegrityUseCase;
    constructor(appendLedgerEntryUseCase: AppendLedgerEntryUseCase, verifyLedgerIntegrityUseCase: VerifyLedgerIntegrityUseCase);
}
