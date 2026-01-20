"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMapper = void 0;
class TransactionMapper {
    static toResponseDto(transaction) {
        return {
            id: transaction.id,
            customerId: transaction.customerId,
            amount: transaction.amount.getValue(),
            type: transaction.type,
            status: transaction.status,
            timestamp: transaction.timestamp,
            hash: transaction.hash,
            metadata: transaction.metadata,
        };
    }
    static toResponseDtoList(transactions) {
        return transactions.map((t) => this.toResponseDto(t));
    }
}
exports.TransactionMapper = TransactionMapper;
//# sourceMappingURL=transaction.mapper.js.map