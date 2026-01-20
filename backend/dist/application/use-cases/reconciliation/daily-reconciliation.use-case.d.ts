import { IReconciliationService } from '../../../domain/interfaces/services/reconciliation.service.interface';
import { ReconciliationResult } from '../../../domain/interfaces/services/reconciliation.service.interface';
export declare class DailyReconciliationUseCase {
    private readonly reconciliationService;
    constructor(reconciliationService: IReconciliationService);
    execute(date?: Date): Promise<ReconciliationResult>;
}
