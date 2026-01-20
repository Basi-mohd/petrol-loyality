import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { OtpService } from '../../../infrastructure/services/otp/otp.service';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { AuditService } from '../../../infrastructure/audit/audit.service';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../../domain/enums/user-role.enum';

export interface VerifyEmployeeOtpDto {
  otpId: string;
  code: string;
  phoneNumber: string;
  deviceId: string;
}

export interface VerifyEmployeeOtpResponse {
  accessToken: string;
  refreshToken: string;
  employee: {
    id: string;
    phoneNumber: string;
    email?: string;
    name?: string;
  };
}

@Injectable()
export class VerifyEmployeeOtpUseCase {
  constructor(
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async execute(dto: VerifyEmployeeOtpDto): Promise<VerifyEmployeeOtpResponse> {
    const isValid = await this.otpService.verifyOtp(
      dto.otpId,
      dto.code,
      dto.phoneNumber,
      dto.deviceId,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid OTP code');
    }

    const employeeId = uuidv4();
    const employeeEmail = `employee-${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}@example.com`;
    const employeeName = `Employee ${dto.phoneNumber.substring(dto.phoneNumber.length - 4)}`;

    try {
      await this.auditService.log(
        employeeId,
        'STAFF',
        'EMPLOYEE_LOGIN',
        'EMPLOYEE',
        employeeId,
        {
          phoneNumber: dto.phoneNumber,
          deviceId: dto.deviceId.substring(0, 8) + '...',
        },
      );
    } catch (err) {
      console.warn('Audit log failed, continuing');
    }

    const payload = {
      sub: employeeId,
      phoneNumber: dto.phoneNumber,
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
        id: employeeId,
        phoneNumber: dto.phoneNumber,
        email: employeeEmail,
        name: employeeName,
      },
    };
  }
}
