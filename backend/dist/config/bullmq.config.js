"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBullMQConfig = void 0;
const getBullMQConfig = (configService) => ({
    connection: {
        host: configService.get('bullmq.host'),
        port: configService.get('bullmq.port'),
        password: configService.get('bullmq.password'),
    },
});
exports.getBullMQConfig = getBullMQConfig;
//# sourceMappingURL=bullmq.config.js.map