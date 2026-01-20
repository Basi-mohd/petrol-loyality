"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sms_config_1 = require("../../../config/sms.config");
let SmsService = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.config = (0, sms_config_1.getSmsConfig)(configService);
    }
    async sendSms(phoneNumber, message) {
        if (this.config.provider === 'twilio') {
            await this.sendViaTwilio(phoneNumber, message);
        }
        else {
            console.log(`[SMS] To: ${phoneNumber}, Message: ${message}`);
        }
    }
    async sendViaTwilio(phoneNumber, message) {
        const accountSid = this.config.apiKey;
        const authToken = this.config.apiSecret;
        if (!accountSid || !authToken) {
            console.warn('[SMS] Twilio credentials not configured, skipping SMS');
            return;
        }
        console.log(`[SMS Twilio] To: ${phoneNumber}, Message: ${message}`);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map