import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OtpController } from '../../presentation/controllers/otp/otp.controller';
import { OtpService } from '../../infrastructure/services/otp/otp.service';
import { RequestOtpUseCase } from '../../application/use-cases/otp/request-otp.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/otp/verify-otp.use-case';
import { OtpOrmEntity } from '../../infrastructure/persistence/postgres/entities/otp.orm-entity';
import { DeviceBindingOrmEntity } from '../../infrastructure/persistence/postgres/entities/device-binding.orm-entity';
import { OtpRepository } from '../../infrastructure/persistence/postgres/repositories/otp.repository';
import { DeviceBindingRepository } from '../../infrastructure/persistence/postgres/repositories/device-binding.repository';
import { SmsModule } from '../../infrastructure/external/sms/sms.module';
import { CustomerRepository } from '../../infrastructure/persistence/postgres/repositories/customer.repository';
import { CustomerOrmEntity } from '../../infrastructure/persistence/postgres/entities/customer.orm-entity';
import { ICustomerRepository } from '../../domain/interfaces/repositories/customer.repository.interface';
import { QrIdentityService } from '../../infrastructure/services/qr-identity/qr-identity.service';
import { CustomerQrIdentityOrmEntity } from '../../infrastructure/persistence/postgres/entities/customer-qr-identity.orm-entity';
import { CustomerQrIdentityRepository } from '../../infrastructure/persistence/postgres/repositories/customer-qr-identity.repository';
import { JwtAuthModule } from '../../infrastructure/security/jwt/jwt.module';
import { CacheModuleRedis } from '../../infrastructure/persistence/redis/cache.module';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../../infrastructure/audit/audit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OtpOrmEntity,
      DeviceBindingOrmEntity,
      CustomerOrmEntity,
      CustomerQrIdentityOrmEntity,
    ]),
    ConfigModule,
    SmsModule,
    JwtAuthModule,
    CacheModuleRedis,
    AuditModule,
  ],
  controllers: [OtpController],
  providers: [
    OtpService,
    RequestOtpUseCase,
    VerifyOtpUseCase,
    {
      provide: 'IOtpRepository',
      useClass: OtpRepository,
    },
    {
      provide: 'IDeviceBindingRepository',
      useClass: DeviceBindingRepository,
    },
    CustomerRepository,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
    QrIdentityService,
    {
      provide: 'ICustomerQrIdentityRepository',
      useClass: CustomerQrIdentityRepository,
    },
    AuditService,
  ],
  exports: [OtpService, QrIdentityService],
})
export class OtpModule {}
