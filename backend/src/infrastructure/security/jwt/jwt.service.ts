import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: Omit<JwtPayload, 'type'>): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.expiresIn') || '1h';
    return this.jwtService.signAsync(
      { ...payload, type: 'access' },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: expiresIn as any,
      },
    );
  }

  async generateRefreshToken(payload: Omit<JwtPayload, 'type'>): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '7d';
    return this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: expiresIn as any,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('jwt.secret'),
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });
  }
}
