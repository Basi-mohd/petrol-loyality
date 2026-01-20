"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmsConfig = void 0;
const getSmsConfig = (configService) => ({
    provider: configService.get('sms.provider'),
    apiKey: configService.get('sms.apiKey'),
    apiSecret: configService.get('sms.apiSecret'),
    fromNumber: configService.get('sms.fromNumber'),
});
exports.getSmsConfig = getSmsConfig;
//# sourceMappingURL=sms.config.js.map