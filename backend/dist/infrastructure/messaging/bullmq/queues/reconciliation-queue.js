"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReconciliationQueue = void 0;
const bullmq_1 = require("bullmq");
const bullmq_config_1 = require("../../../../config/bullmq.config");
const queue_names_constants_1 = require("../../../../shared/constants/queue-names.constants");
const createReconciliationQueue = (configService) => {
    const config = (0, bullmq_config_1.getBullMQConfig)(configService);
    return new bullmq_1.Queue(queue_names_constants_1.QUEUE_NAMES.RECONCILIATION, {
        connection: config.connection,
    });
};
exports.createReconciliationQueue = createReconciliationQueue;
//# sourceMappingURL=reconciliation-queue.js.map