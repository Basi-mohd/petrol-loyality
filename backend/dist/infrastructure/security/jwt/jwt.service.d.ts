import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    type: 'access' | 'refresh';
}
export declare class JwtService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: NestJwtService, configService: ConfigService);
    generateAccessToken(payload: Omit<JwtPayload, 'type'>): Promise<string>;
    generateRefreshToken(payload: Omit<JwtPayload, 'type'>): Promise<string>;
    verifyAccessToken(token: string): Promise<JwtPayload>;
    verifyRefreshToken(token: string): Promise<JwtPayload>;
}
