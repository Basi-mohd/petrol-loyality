import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
import { IEmployeeRepository } from '../../../domain/interfaces/repositories/employee.repository.interface';
export interface EmployeeLoginDto {
    employeeId: string;
    password: string;
}
export interface EmployeeLoginResponse {
    accessToken: string;
    refreshToken: string;
    employee: {
        id: string;
        employeeId: string;
        name: string;
    };
}
export declare class EmployeeLoginUseCase {
    private readonly employeeRepository;
    private readonly jwtService;
    private readonly auditService;
    constructor(employeeRepository: IEmployeeRepository, jwtService: JwtService, auditService: AuditService);
    execute(dto: EmployeeLoginDto): Promise<EmployeeLoginResponse>;
}
