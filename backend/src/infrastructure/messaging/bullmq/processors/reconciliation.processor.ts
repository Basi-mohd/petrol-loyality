import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../../../../shared/constants/queue-names.constants';

export interface ReconciliationJobData {
  startDate: string;
  endDate: string;
}

@Processor(QUEUE_NAMES.RECONCILIATION)
export class ReconciliationProcessor extends WorkerHost {
  async process(job: Job<ReconciliationJobData>): Promise<any> {
    const { startDate, endDate } = job.data;

    try {
      await job.updateProgress(10);

      await job.updateProgress(50);

      await job.updateProgress(100);

      return {
        success: true,
        startDate,
        endDate,
        processedAt: new Date(),
      };
    } catch (error) {
      throw error;
    }
  }
}
