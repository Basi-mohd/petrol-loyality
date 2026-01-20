import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export interface ReconciliationJobData {
    startDate: string;
    endDate: string;
}
export declare class ReconciliationProcessor extends WorkerHost {
    process(job: Job<ReconciliationJobData>): Promise<any>;
}
