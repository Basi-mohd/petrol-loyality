import { Repository } from 'typeorm';
import { IEmployeeRepository } from '../../../../domain/interfaces/repositories/employee.repository.interface';
import { Employee } from '../../../../domain/entities/employee.entity';
import { EmployeeOrmEntity } from '../entities/employee.orm-entity';
export declare class EmployeeRepository implements IEmployeeRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<EmployeeOrmEntity>);
    save(employee: Employee): Promise<void>;
    findById(id: string): Promise<Employee | null>;
    findByEmployeeId(employeeId: string): Promise<Employee | null>;
    private toOrmEntity;
    private toDomainEntity;
}
