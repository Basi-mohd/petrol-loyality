"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntry = void 0;
const ledger_hash_vo_1 = require("../value-objects/ledger-hash.vo");
const hash_utils_1 = require("../../shared/utils/hash.utils");
class LedgerEntry {
    constructor(id, transactionId, customerId, amount, type, previousHash, hash, timestamp, metadata) {
        this.id = id;
        this.transactionId = transactionId;
        this.customerId = customerId;
        this.amount = amount;
        this.type = type;
        this.previousHash = previousHash;
        this.hash = hash;
        this.timestamp = timestamp;
        this.metadata = metadata;
    }
    static create(transactionId, customerId, amount, type, previousHash, metadata = {}) {
        const id = hash_utils_1.HashUtils.generateId();
        const timestamp = new Date();
        const hashValue = previousHash
            ? hash_utils_1.HashUtils.createHashChain(previousHash.getValue(), `${id}${transactionId}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`)
            : hash_utils_1.HashUtils.sha256(`${id}${transactionId}${customerId}${amount.getValue()}${type}${timestamp.toISOString()}`);
        return new LedgerEntry(id, transactionId, customerId, amount, type, previousHash, ledger_hash_vo_1.LedgerHash.create(hashValue), timestamp, metadata);
    }
    static reconstruct(id, transactionId, customerId, amount, type, previousHash, hash, timestamp, metadata) {
        return new LedgerEntry(id, transactionId, customerId, amount, type, previousHash, hash, timestamp, metadata);
    }
    verifyIntegrity(previousHash) {
        const expectedHash = previousHash
            ? hash_utils_1.HashUtils.createHashChain(previousHash.getValue(), `${this.id}${this.transactionId}${this.customerId}${this.amount.getValue()}${this.type}${this.timestamp.toISOString()}`)
            : hash_utils_1.HashUtils.sha256(`${this.id}${this.transactionId}${this.customerId}${this.amount.getValue()}${this.type}${this.timestamp.toISOString()}`);
        return this.hash.getValue() === expectedHash;
    }
}
exports.LedgerEntry = LedgerEntry;
//# sourceMappingURL=ledger-entry.entity.js.map