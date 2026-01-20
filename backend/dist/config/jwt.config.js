"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtRefreshConfig = exports.getJwtConfig = void 0;
const getJwtConfig = (configService) => {
    const expiresIn = configService.get('jwt.expiresIn') || '1h';
    return {
        secret: configService.get('jwt.secret'),
        signOptions: {
            expiresIn: expiresIn,
        },
    };
};
exports.getJwtConfig = getJwtConfig;
const getJwtRefreshConfig = (configService) => ({
    secret: configService.get('jwt.refreshSecret'),
    signOptions: {
        expiresIn: configService.get('jwt.refreshExpiresIn'),
    },
});
exports.getJwtRefreshConfig = getJwtRefreshConfig;
//# sourceMappingURL=jwt.config.js.map