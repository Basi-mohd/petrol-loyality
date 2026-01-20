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
export declare class AuthenticateUserUseCase {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    execute(dto: AuthenticateUserDto): Promise<AuthenticateUserResponse>;
}
