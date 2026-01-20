import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEmployeeRepository } from '../../../../domain/interfaces/repositories/employee.repository.interface';
import { Employee } from '../../../../domain/entities/employee.entity';
import { EmployeeOrmEntity } from '../entities/employee.orm-entity';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly ormRepository: Repository<EmployeeOrmEntity>,
  ) {}

  async save(employee: Employee): Promise<void> {
    const ormEntity = this.toOrmEntity(employee);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<Employee | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { employeeId },
    });
    return ormEntity ? this.toDomainEntity(ormEntity) : null;
  }

  private toOrmEntity(employee: Employee): EmployeeOrmEntity {
    const ormEntity = new EmployeeOrmEntity();
    ormEntity.id = employee.id;
    ormEntity.employeeId = employee.employeeId;
    ormEntity.passwordHash = employee.passwordHash;
    ormEntity.name = employee.name;
    ormEntity.isActive = employee.isActive;
    ormEntity.createdAt = employee.createdAt;
    ormEntity.updatedAt = employee.updatedAt;
    return ormEntity;
  }

  private toDomainEntity(ormEntity: EmployeeOrmEntity): Employee {
    return Employee.reconstruct(
      ormEntity.id,
      ormEntity.employeeId,
      ormEntity.passwordHash,
      ormEntity.name,
      ormEntity.isActive,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }
}
