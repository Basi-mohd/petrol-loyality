import { IReconciliationService, ReconciliationResult } from '../../domain/interfaces/services/reconciliation.service.interface';
import { ILedgerRepository } from '../../domain/interfaces/repositories/ledger.repository.interface';
import { ITransactionRepository } from '../../domain/interfaces/repositories/transaction.repository.interface';
export declare class ReconciliationService implements IReconciliationService {
    private readonly ledgerRepository;
    private readonly transactionRepository;
    constructor(ledgerRepository: ILedgerRepository, transactionRepository: ITransactionRepository);
    reconcile(startDate: Date, endDate: Date): Promise<ReconciliationResult>;
}
