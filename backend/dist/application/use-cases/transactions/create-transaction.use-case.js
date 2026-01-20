"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const transaction_entity_1 = require("../../../domain/entities/transaction.entity");
const amount_vo_1 = require("../../../domain/value-objects/amount.vo");
const transaction_signature_vo_1 = require("../../../domain/value-objects/transaction-signature.vo");
const transaction_type_enum_1 = require("../../../domain/enums/transaction-type.enum");
const transaction_mapper_1 = require("../../mappers/transaction.mapper");
const invalid_signature_exception_1 = require("../../../domain/exceptions/invalid-signature.exception");
const insufficient_balance_exception_1 = require("../../../domain/exceptions/insufficient-balance.exception");
let CreateTransactionUseCase = class CreateTransactionUseCase {
    constructor(transactionRepository, ledgerRepository, customerRepository, fraudDetectionService, signatureVerificationService) {
        this.transactionRepository = transactionRepository;
        this.ledgerRepository = ledgerRepository;
        this.customerRepository = customerRepository;
        this.fraudDetectionService = fraudDetectionService;
        this.signatureVerificationService = signatureVerificationService;
    }
    async execute(dto) {
        const customer = await this.customerRepository.findById(dto.customerId);
        if (!customer) {
            throw new Error('Customer not found');
        }
        const amount = amount_vo_1.Amount.create(dto.amount);
        const signature = transaction_signature_vo_1.TransactionSignature.create(dto.signature, dto.publicKey);
        const transactionData = JSON.stringify({
            customerId: dto.customerId,
            amount: dto.amount,
            type: dto.type,
            timestamp: new Date().toISOString(),
        });
        const isValidSignature = await this.signatureVerificationService.verify(signature, transactionData);
        if (!isValidSignature) {
            throw new invalid_signature_exception_1.InvalidSignatureException();
        }
        if (dto.type === transaction_type_enum_1.TransactionType.DEBIT) {
            if (customer.balance.isGreaterThan(amount) || customer.balance.equals(amount)) {
            }
            else {
                throw new insufficient_balance_exception_1.InsufficientBalanceException(amount.getValue(), customer.balance.getValue());
            }
        }
        const lastHash = await this.ledgerRepository.getLastHash(dto.customerId);
        const previousHash = lastHash || null;
        const transaction = transaction_entity_1.Transaction.create(dto.customerId, amount, dto.type, signature, dto.metadata || {}, previousHash?.getValue());
        const fraudResult = await this.fraudDetectionService.detectFraud(transaction);
        if (fraudResult.isFraudulent) {
            const failedTransaction = transaction.markAsFailed();
            await this.transactionRepository.save(failedTransaction);
            throw new Error(`Fraud detected: ${fraudResult.reasons.join(', ')}`);
        }
        const completedTransaction = transaction.markAsCompleted();
        await this.transactionRepository.save(completedTransaction);
        const ledgerEntry = await this.ledgerRepository.getLastEntry(dto.customerId);
        const ledgerPreviousHash = ledgerEntry?.hash || null;
        const { LedgerEntry } = await Promise.resolve().then(() => __importStar(require('../../../domain/entities/ledger-entry.entity')));
        const newLedgerEntry = LedgerEntry.create(completedTransaction.id, dto.customerId, amount, dto.type, ledgerPreviousHash, dto.metadata || {});
        await this.ledgerRepository.append(newLedgerEntry);
        if (dto.type === transaction_type_enum_1.TransactionType.CREDIT) {
            const updatedCustomer = customer.credit(amount);
            await this.customerRepository.update(updatedCustomer);
        }
        else if (dto.type === transaction_type_enum_1.TransactionType.DEBIT) {
            const updatedCustomer = customer.debit(amount);
            await this.customerRepository.update(updatedCustomer);
        }
        return transaction_mapper_1.TransactionMapper.toResponseDto(completedTransaction);
    }
};
exports.CreateTransactionUseCase = CreateTransactionUseCase;
exports.CreateTransactionUseCase = CreateTransactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __param(1, (0, common_1.Inject)('ILedgerRepository')),
    __param(2, (0, common_1.Inject)('ICustomerRepository')),
    __param(3, (0, common_1.Inject)('IFraudDetectionService')),
    __param(4, (0, common_1.Inject)('ISignatureVerificationService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateTransactionUseCase);
//# sourceMappingURL=create-transaction.use-case.js.map