export declare class TransactionResponseDto {
    id: string;
    customerId: string;
    amount: number;
    type: string;
    status: string;
    timestamp: Date;
    hash?: string;
    metadata?: Record<string, any>;
}
