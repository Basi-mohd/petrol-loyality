import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/controllers/auth/auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateUserUseCase } from '../../application/use-cases/auth/authenticate-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { JwtAuthModule } from '../../infrastructure/security/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
  ],
  exports: [AuthService],
})
export class AuthModule {}
