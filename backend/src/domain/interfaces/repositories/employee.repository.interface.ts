import { Employee } from '../../entities/employee.entity';

export interface IEmployeeRepository {
  findByEmployeeId(employeeId: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  save(employee: Employee): Promise<void>;
}
