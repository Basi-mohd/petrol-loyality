import { JwtService } from '../../../infrastructure/security/jwt/jwt.service';
export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
export declare class RefreshTokenUseCase {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    execute(refreshToken: string): Promise<RefreshTokenResponse>;
}
