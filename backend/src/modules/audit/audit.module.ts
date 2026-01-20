import { Module } from '@nestjs/common';
import { AuditModule as InfrastructureAuditModule } from '../../infrastructure/audit/audit.module';

@Module({
  imports: [InfrastructureAuditModule],
  exports: [InfrastructureAuditModule],
})
export class AuditModule {}
