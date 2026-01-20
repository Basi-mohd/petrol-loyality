"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const queue_names_constants_1 = require("../../../../shared/constants/queue-names.constants");
let SmsProcessor = class SmsProcessor extends bullmq_1.WorkerHost {
    async process(job) {
        const { phoneNumber, message } = job.data;
        try {
            await job.updateProgress(10);
            await job.updateProgress(50);
            await job.updateProgress(100);
            return {
                success: true,
                phoneNumber,
                sentAt: new Date(),
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.SmsProcessor = SmsProcessor;
exports.SmsProcessor = SmsProcessor = __decorate([
    (0, bullmq_1.Processor)(queue_names_constants_1.QUEUE_NAMES.SMS)
], SmsProcessor);
//# sourceMappingURL=sms.processor.js.map