import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const { type, ...tokenPayload } = payload;

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.generateAccessToken(tokenPayload),
        this.jwtService.generateRefreshToken(tokenPayload),
      ]);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
