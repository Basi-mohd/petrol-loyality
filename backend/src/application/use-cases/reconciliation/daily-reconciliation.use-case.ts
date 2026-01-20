import { Injectable, Inject } from '@nestjs/common';
import { IReconciliationService } from '../../../domain/interfaces/services/reconciliation.service.interface';
import { ReconciliationResult } from '../../../domain/interfaces/services/reconciliation.service.interface';
import { DateUtils } from '../../../shared/utils/date.utils';

@Injectable()
export class DailyReconciliationUseCase {
  constructor(
    @Inject('IReconciliationService')
    private readonly reconciliationService: IReconciliationService,
  ) {}

  async execute(date?: Date): Promise<ReconciliationResult> {
    const targetDate = date || new Date();
    const startDate = DateUtils.startOfDay(targetDate);
    const endDate = DateUtils.endOfDay(targetDate);

    return this.reconciliationService.reconcile(startDate, endDate);
  }
}
