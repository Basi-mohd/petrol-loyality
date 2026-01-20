export class OfflineSyncDto {
  transactions: Array<{
    id: string;
    customerId: string;
    amount: number;
    type: string;
    signature: string;
    publicKey: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}
