export interface ReconciliationResult {
    isBalanced: boolean;
    discrepancies: Array<{
        type: string;
        description: string;
        amount: number;
    }>;
    totalTransactions: number;
    totalAmount: number;
}
export interface IReconciliationService {
    reconcile(startDate: Date, endDate: Date): Promise<ReconciliationResult>;
}
