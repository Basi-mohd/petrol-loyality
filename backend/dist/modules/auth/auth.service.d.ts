import { AuthenticateUserUseCase } from '../../application/use-cases/auth/authenticate-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
export declare class AuthService {
    private readonly authenticateUserUseCase;
    private readonly refreshTokenUseCase;
    constructor(authenticateUserUseCase: AuthenticateUserUseCase, refreshTokenUseCase: RefreshTokenUseCase);
}
