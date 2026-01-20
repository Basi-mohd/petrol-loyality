import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';
export declare class VerifyLedgerIntegrityUseCase {
    private readonly ledgerRepository;
    constructor(ledgerRepository: ILedgerRepository);
    execute(): Promise<boolean>;
}
