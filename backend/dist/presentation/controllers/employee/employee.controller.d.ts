import { EmployeeLoginUseCase } from '../../../application/use-cases/employee/employee-login.use-case';
import { EmployeeLoginRequestDto } from '../../dto/employee/employee-login-request.dto';
export declare class EmployeeController {
    private readonly employeeLoginUseCase;
    constructor(employeeLoginUseCase: EmployeeLoginUseCase);
    login(dto: EmployeeLoginRequestDto): Promise<import("../../../application/use-cases/employee/employee-login.use-case").EmployeeLoginResponse>;
}
