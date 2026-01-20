import { Module } from '@nestjs/common';
import { FraudDetectionModule as InfrastructureFraudDetectionModule } from '../../infrastructure/fraud-detection/fraud-detection.module';

@Module({
  imports: [InfrastructureFraudDetectionModule],
  exports: [InfrastructureFraudDetectionModule],
})
export class FraudDetectionModule {}
