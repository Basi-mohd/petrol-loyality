import { ILedgerRepository } from '../../../domain/interfaces/repositories/ledger.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class AppendLedgerEntryUseCase {
    private readonly ledgerRepository;
    private readonly transactionRepository;
    constructor(ledgerRepository: ILedgerRepository, transactionRepository: ITransactionRepository);
    execute(transactionId: string): Promise<void>;
}
