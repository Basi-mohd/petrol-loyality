export declare class CreateTransactionRequestDto {
    customerId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT' | 'REFUND';
    signature: string;
    publicKey: string;
    metadata?: Record<string, any>;
}
