import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { AuthModule } from './modules/auth/auth.module';
import { FraudDetectionModule } from './modules/fraud-detection/fraud-detection.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { AuditModule } from './modules/audit/audit.module';
import { OtpModule } from './modules/otp/otp.module';
import { EmployeeOtpModule } from './modules/employee-otp/employee-otp.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CacheModuleRedis } from './infrastructure/persistence/redis/cache.module';
import { HealthController } from './presentation/controllers/health/health.controller';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

let BullMQModule: any = null;
if (process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost') {
  try {
    BullMQModule = require('./infrastructure/messaging/bullmq/bullmq.module').BullMQModule;
  } catch (error) {
    console.warn('BullMQ module not available, skipping...');
  }
}
import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter';
import { ValidationExceptionFilter } from './presentation/filters/validation-exception.filter';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { AuditInterceptor } from './presentation/interceptors/audit.interceptor';
import { ValidationPipe } from './presentation/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    CacheModuleRedis,
    ...(BullMQModule ? [BullMQModule] : []),
    TransactionsModule,
    LedgerModule,
    AuthModule,
    FraudDetectionModule,
    ReconciliationModule,
    AuditModule,
    OtpModule,
    EmployeeOtpModule,
    EmployeeModule,
    CustomerModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
