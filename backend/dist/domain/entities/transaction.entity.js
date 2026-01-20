"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const transaction_status_enum_1 = require("../enums/transaction-status.enum");
const hash_utils_1 = require("../../shared/utils/hash.utils");
class Transaction {
    constructor(id, customerId, amount, type, status, signature, timestamp, metadata, previousHash, hash) {
        this.id = id;
        this.customerId = customerId;
        this.amount = amount;
        this.type = type;
        this.status = status;
        this.signature = signature;
        this.timestamp = timestamp;
        this.metadata = metadata;
        this.previousHash = previousHash;
        this.hash = hash;
    }
    static create(customerId, amount, type, signature, metadata = {}, previousHash) {
        const id = hash_utils_1.HashUtils.generateId();
        const timestamp = new Date();
        const hash = previousHash
            ? hash_utils_1.HashUtils.createHashChain(previousHash, `${id}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`)
            : hash_utils_1.HashUtils.sha256(`${id}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`);
        return new Transaction(id, customerId, amount, type, transaction_status_enum_1.TransactionStatus.PENDING, signature, timestamp, metadata, previousHash, hash);
    }
    static reconstruct(id, customerId, amount, type, status, signature, timestamp, metadata, previousHash, hash) {
        return new Transaction(id, customerId, amount, type, status, signature, timestamp, metadata, previousHash, hash);
    }
    verifySignature(publicKey) {
        return this.signature.getPublicKey() === publicKey;
    }
    markAsCompleted() {
        return new Transaction(this.id, this.customerId, this.amount, this.type, transaction_status_enum_1.TransactionStatus.COMPLETED, this.signature, this.timestamp, this.metadata, this.previousHash, this.hash);
    }
    markAsFailed() {
        return new Transaction(this.id, this.customerId, this.amount, this.type, transaction_status_enum_1.TransactionStatus.FAILED, this.signature, this.timestamp, this.metadata, this.previousHash, this.hash);
    }
    markAsSyncPending() {
        return new Transaction(this.id, this.customerId, this.amount, this.type, transaction_status_enum_1.TransactionStatus.SYNC_PENDING, this.signature, this.timestamp, this.metadata, this.previousHash, this.hash);
    }
    markAsCancelled() {
        return new Transaction(this.id, this.customerId, this.amount, this.type, transaction_status_enum_1.TransactionStatus.CANCELLED, this.signature, this.timestamp, this.metadata, this.previousHash, this.hash);
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map