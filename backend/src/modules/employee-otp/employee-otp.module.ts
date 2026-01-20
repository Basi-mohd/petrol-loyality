import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmployeeOtpController } from '../../presentation/controllers/employee-otp/employee-otp.controller';
import { OtpService } from '../../infrastructure/services/otp/otp.service';
import { RequestEmployeeOtpUseCase } from '../../application/use-cases/employee-otp/request-employee-otp.use-case';
import { VerifyEmployeeOtpUseCase } from '../../application/use-cases/employee-otp/verify-employee-otp.use-case';
import { OtpOrmEntity } from '../../infrastructure/persistence/postgres/entities/otp.orm-entity';
import { DeviceBindingOrmEntity } from '../../infrastructure/persistence/postgres/entities/device-binding.orm-entity';
import { OtpRepository } from '../../infrastructure/persistence/postgres/repositories/otp.repository';
import { DeviceBindingRepository } from '../../infrastructure/persistence/postgres/repositories/device-binding.repository';
import { SmsModule } from '../../infrastructure/external/sms/sms.module';
import { JwtAuthModule } from '../../infrastructure/security/jwt/jwt.module';
import { CacheModuleRedis } from '../../infrastructure/persistence/redis/cache.module';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../../infrastructure/audit/audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OtpOrmEntity,
      DeviceBindingOrmEntity,
    ]),
    ConfigModule,
    SmsModule,
    JwtAuthModule,
    CacheModuleRedis,
    AuditModule,
  ],
  controllers: [EmployeeOtpController],
  providers: [
    OtpService,
    RequestEmployeeOtpUseCase,
    VerifyEmployeeOtpUseCase,
    {
      provide: 'IOtpRepository',
      useClass: OtpRepository,
    },
    {
      provide: 'IDeviceBindingRepository',
      useClass: DeviceBindingRepository,
    },
    AuditService,
  ],
  exports: [OtpService],
})
export class EmployeeOtpModule {}
