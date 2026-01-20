export declare class LedgerEntryOrmEntity {
    id: string;
    transactionId: string;
    customerId: string;
    amount: number;
    type: string;
    previousHash: string;
    hash: string;
    timestamp: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
