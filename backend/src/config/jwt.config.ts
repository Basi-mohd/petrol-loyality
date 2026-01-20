import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => {
  const expiresIn = configService.get<string>('jwt.expiresIn') || '1h';
  return {
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
      expiresIn: expiresIn as any,
    },
  };
};

export const getJwtRefreshConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('jwt.refreshSecret'),
  signOptions: {
    expiresIn: configService.get<string>('jwt.refreshExpiresIn'),
  },
});
