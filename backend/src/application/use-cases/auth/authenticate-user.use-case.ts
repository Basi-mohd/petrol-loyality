import { Injectable } from '@nestjs/common';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
import { UserRole } from '../../../domain/enums/user-role.enum';

export interface AuthenticateUserDto {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthenticateUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phoneNumber?: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(
    dto: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponse> {
    const userId = 'user-123';
    const role = UserRole.CUSTOMER;

    const payload = {
      sub: userId,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateAccessToken(payload),
      this.jwtService.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        role,
      },
    };
  }
}
