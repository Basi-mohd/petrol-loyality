import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from '../../presentation/controllers/employee/employee.controller';
import { EmployeeLoginUseCase } from '../../application/use-cases/employee/employee-login.use-case';
import { EmployeeOrmEntity } from '../../infrastructure/persistence/postgres/entities/employee.orm-entity';
import { EmployeeRepository } from '../../infrastructure/persistence/postgres/repositories/employee.repository';
import { JwtAuthModule } from '../../infrastructure/security/jwt/jwt.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeOrmEntity]),
    JwtAuthModule,
    AuditModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeLoginUseCase,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeeLoginUseCase],
})
export class EmployeeModule {}
