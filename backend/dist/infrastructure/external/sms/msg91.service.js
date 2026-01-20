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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Msg91Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg91Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let Msg91Service = Msg91Service_1 = class Msg91Service {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(Msg91Service_1.name);
        this.baseUrl = 'https://api.msg91.com/api/v2/sendsms';
        this.apiKey = this.configService.get('sms.msg91.apiKey') || '';
        this.senderId = this.configService.get('sms.msg91.senderId') || 'PETROL';
    }
    async sendSms(phoneNumber, message) {
        if (!this.apiKey) {
            this.logger.warn('MSG91 API key not configured, skipping SMS');
            return;
        }
        try {
            const cleanedPhone = this.cleanPhoneNumber(phoneNumber);
            const payload = {
                sender: this.senderId,
                route: '4',
                country: '91',
                sms: [
                    {
                        message,
                        to: [cleanedPhone],
                    },
                ],
            };
            const response = await axios_1.default.post(this.baseUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    authkey: this.apiKey,
                },
                timeout: 10000,
            });
            if (response.data && response.data.type === 'success') {
                this.logger.log(`SMS sent successfully to ${cleanedPhone}`);
            }
            else {
                this.logger.error(`MSG91 API error: ${JSON.stringify(response.data)}`);
                throw new Error(`Failed to send SMS: ${(response.data && response.data.message) || 'Unknown error'}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${phoneNumber}: ${error.message}`);
            if (axios_1.default.isAxiosError(error)) {
                throw new Error(`SMS service error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
    cleanPhoneNumber(phoneNumber) {
        return phoneNumber.replace(/\D/g, '');
    }
};
exports.Msg91Service = Msg91Service;
exports.Msg91Service = Msg91Service = Msg91Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], Msg91Service);
//# sourceMappingURL=msg91.service.js.map