"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BullMQModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const bullmq_config_1 = require("../../../config/bullmq.config");
const queue_names_constants_1 = require("../../../shared/constants/queue-names.constants");
const transaction_processor_1 = require("./processors/transaction.processor");
const reconciliation_processor_1 = require("./processors/reconciliation.processor");
const sms_processor_1 = require("./processors/sms.processor");
let BullMQModule = class BullMQModule {
};
exports.BullMQModule = BullMQModule;
exports.BullMQModule = BullMQModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => (0, bullmq_config_1.getBullMQConfig)(configService),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: queue_names_constants_1.QUEUE_NAMES.TRANSACTION }, { name: queue_names_constants_1.QUEUE_NAMES.RECONCILIATION }, { name: queue_names_constants_1.QUEUE_NAMES.SMS }),
        ],
        providers: [
            transaction_processor_1.TransactionProcessor,
            reconciliation_processor_1.ReconciliationProcessor,
            sms_processor_1.SmsProcessor,
        ],
        exports: [bullmq_1.BullModule],
    })
], BullMQModule);
//# sourceMappingURL=bullmq.module.js.map