import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export interface TransactionJobData {
    transactionId: string;
    customerId: string;
    amount: number;
    type: string;
}
export declare class TransactionProcessor extends WorkerHost {
    process(job: Job<TransactionJobData>): Promise<any>;
}
