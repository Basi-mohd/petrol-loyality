"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CACHE_KEYS = void 0;
exports.CACHE_KEYS = {
    CUSTOMER: (id) => `customer:${id}`,
    TRANSACTION: (id) => `transaction:${id}`,
    LEDGER_ENTRY: (id) => `ledger:${id}`,
    CUSTOMER_BALANCE: (id) => `balance:${id}`,
    FRAUD_CHECK: (customerId) => `fraud:${customerId}`,
};
//# sourceMappingURL=cache-keys.constants.js.map