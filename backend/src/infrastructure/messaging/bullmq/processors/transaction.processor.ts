import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue-names.constants';

export interface TransactionJobData {
  transactionId: string;
  customerId: string;
  amount: number;
  type: string;
}

@Processor(QUEUE_NAMES.TRANSACTION)
export class TransactionProcessor extends WorkerHost {
  async process(job: Job<TransactionJobData>): Promise<any> {
    const { transactionId, customerId, amount, type } = job.data;

    try {
      await job.updateProgress(10);

      await job.updateProgress(50);

      await job.updateProgress(100);

      return {
        success: true,
        transactionId,
        processedAt: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }
}
