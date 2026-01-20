"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSignature = void 0;
class TransactionSignature {
    constructor(signature, publicKey) {
        this.signature = signature;
        this.publicKey = publicKey;
        if (!signature || signature.trim().length === 0) {
            throw new Error('Signature cannot be empty');
        }
        if (!publicKey || publicKey.trim().length === 0) {
            throw new Error('Public key cannot be empty');
        }
    }
    static create(signature, publicKey) {
        return new TransactionSignature(signature, publicKey);
    }
    getSignature() {
        return this.signature;
    }
    getPublicKey() {
        return this.publicKey;
    }
    equals(other) {
        return (this.signature === other.signature &&
            this.publicKey === other.publicKey);
    }
}
exports.TransactionSignature = TransactionSignature;
//# sourceMappingURL=transaction-signature.vo.js.map