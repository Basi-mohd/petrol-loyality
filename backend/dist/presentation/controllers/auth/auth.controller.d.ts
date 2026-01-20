import { AuthenticateUserUseCase } from '../../../application/use-cases/auth/authenticate-user.use-case';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/refresh-token.use-case';
import { LoginRequestDto } from '../../dto/auth/login-request.dto';
export declare class AuthController {
    private readonly authenticateUserUseCase;
    private readonly refreshTokenUseCase;
    constructor(authenticateUserUseCase: AuthenticateUserUseCase, refreshTokenUseCase: RefreshTokenUseCase);
    login(dto: LoginRequestDto): Promise<import("../../../application/use-cases/auth/authenticate-user.use-case").AuthenticateUserResponse>;
    refresh(refreshToken: string): Promise<import("../../../application/use-cases/auth/refresh-token.use-case").RefreshTokenResponse>;
}
