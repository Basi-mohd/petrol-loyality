import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from '../../presentation/controllers/customer/customer.controller';
import { RegenerateQrIdentityUseCase } from '../../application/use-cases/customer/regenerate-qr-identity.use-case';
import { QrIdentityService } from '../../infrastructure/services/qr-identity/qr-identity.service';
import { CustomerQrIdentityOrmEntity } from '../../infrastructure/persistence/postgres/entities/customer-qr-identity.orm-entity';
import { CustomerQrIdentityRepository } from '../../infrastructure/persistence/postgres/repositories/customer-qr-identity.repository';
import { CustomerOrmEntity } from '../../infrastructure/persistence/postgres/entities/customer.orm-entity';
import { CustomerRepository } from '../../infrastructure/persistence/postgres/repositories/customer.repository';
import { ICustomerRepository } from '../../domain/interfaces/repositories/customer.repository.interface';
import { JwtAuthModule } from '../../infrastructure/security/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerQrIdentityOrmEntity,
      CustomerOrmEntity,
    ]),
    JwtAuthModule,
  ],
  controllers: [CustomerController],
  providers: [
    RegenerateQrIdentityUseCase,
    QrIdentityService,
    {
      provide: 'ICustomerQrIdentityRepository',
      useClass: CustomerQrIdentityRepository,
    },
    CustomerRepository,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  exports: [QrIdentityService],
})
export class CustomerModule {}
