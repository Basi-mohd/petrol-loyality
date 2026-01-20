import { Module } from '@nestjs/common';
import { ReconciliationModule as InfrastructureReconciliationModule } from '../../infrastructure/reconciliation/reconciliation.module';

@Module({
  imports: [InfrastructureReconciliationModule],
  exports: [InfrastructureReconciliationModule],
})
export class ReconciliationModule {}
