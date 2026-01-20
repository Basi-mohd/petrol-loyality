"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSignatureException = void 0;
const domain_exception_1 = require("./domain-exception");
class InvalidSignatureException extends domain_exception_1.DomainException {
    constructor(message = 'Invalid transaction signature') {
        super(message, 'INVALID_SIGNATURE', 400);
        this.name = 'InvalidSignatureException';
    }
}
exports.InvalidSignatureException = InvalidSignatureException;
//# sourceMappingURL=invalid-signature.exception.js.map