"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientBalanceException = void 0;
const domain_exception_1 = require("./domain-exception");
class InsufficientBalanceException extends domain_exception_1.DomainException {
    constructor(required, available) {
        super(`Insufficient balance. Required: ${required}, Available: ${available}`, 'INSUFFICIENT_BALANCE', 400);
        this.name = 'InsufficientBalanceException';
    }
}
exports.InsufficientBalanceException = InsufficientBalanceException;
//# sourceMappingURL=insufficient-balance.exception.js.map