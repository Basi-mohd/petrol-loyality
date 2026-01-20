export declare class TransactionOrmEntity {
    id: string;
    customerId: string;
    amount: number;
    type: string;
    status: string;
    signature: string;
    publicKey: string;
    timestamp: Date;
    metadata: Record<string, any>;
    previousHash: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
}
