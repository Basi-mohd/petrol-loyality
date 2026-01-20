import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
import { IEmployeeRepository } from '../../../domain/interfaces/repositories/employee.repository.interface';
import { UserRole } from '../../../domain/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

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

@Injectable()
export class EmployeeLoginUseCase {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async execute(dto: EmployeeLoginDto): Promise<EmployeeLoginResponse> {
    const employee = await this.employeeRepository.findByEmployeeId(
      dto.employeeId,
    );

    if (!employee) {
      throw new UnauthorizedException('Invalid employee ID or password');
    }

    if (!employee.isActive) {
      throw new UnauthorizedException('Employee account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      employee.passwordHash,
    );

    if (!isPasswordValid) {
      try {
        await this.auditService.log(
          employee.id,
          'STAFF',
          'EMPLOYEE_LOGIN_FAILED',
          'EMPLOYEE',
          employee.id,
          {
            employeeId: dto.employeeId,
            reason: 'Invalid password',
          },
        );
      } catch (err) {
        console.warn('Audit log failed, continuing');
      }
      throw new UnauthorizedException('Invalid employee ID or password');
    }

    try {
      await this.auditService.log(
        employee.id,
        'STAFF',
        'EMPLOYEE_LOGIN',
        'EMPLOYEE',
        employee.id,
        {
          employeeId: dto.employeeId,
        },
      );
    } catch (err) {
      console.warn('Audit log failed, continuing');
    }

    const payload = {
      sub: employee.id,
      employeeId: employee.employeeId,
      role: UserRole.STAFF,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken(payload),
      this.jwtService.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        name: employee.name,
      },
    };
  }
}
