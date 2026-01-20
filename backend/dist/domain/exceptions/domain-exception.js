"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message, code, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'DomainException';
        Object.setPrototypeOf(this, DomainException.prototype);
    }
}
exports.DomainException = DomainException;
//# sourceMappingURL=domain-exception.js.map