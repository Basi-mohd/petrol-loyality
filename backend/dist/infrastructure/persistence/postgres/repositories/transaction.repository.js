"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../../../../domain/entities/transaction.entity");
const transaction_orm_entity_1 = require("../entities/transaction.orm-entity");
const amount_vo_1 = require("../../../../domain/value-objects/amount.vo");
const transaction_signature_vo_1 = require("../../../../domain/value-objects/transaction-signature.vo");
const transaction_status_enum_1 = require("../../../../domain/enums/transaction-status.enum");
let TransactionRepository = class TransactionRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async save(transaction) {
        const ormEntity = this.toOrmEntity(transaction);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByCustomerId(customerId) {
        const ormEntities = await this.ormRepository.find({
            where: { customerId },
            order: { timestamp: 'DESC' },
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async findPendingSync() {
        const ormEntities = await this.ormRepository.find({
            where: { status: transaction_status_enum_1.TransactionStatus.SYNC_PENDING },
            order: { timestamp: 'ASC' },
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async findByStatus(status) {
        const ormEntities = await this.ormRepository.find({
            where: { status },
            order: { timestamp: 'DESC' },
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async countByCustomerId(customerId) {
        return this.ormRepository.count({ where: { customerId } });
    }
    toOrmEntity(transaction) {
        const entity = new transaction_orm_entity_1.TransactionOrmEntity();
        entity.id = transaction.id;
        entity.customerId = transaction.customerId;
        entity.amount = transaction.amount.getValue();
        entity.type = transaction.type;
        entity.status = transaction.status;
        entity.signature = transaction.signature.getSignature();
        entity.publicKey = transaction.signature.getPublicKey();
        entity.timestamp = transaction.timestamp;
        entity.metadata = transaction.metadata;
        entity.previousHash = transaction.previousHash;
        entity.hash = transaction.hash;
        return entity;
    }
    toDomainEntity(ormEntity) {
        return transaction_entity_1.Transaction.reconstruct(ormEntity.id, ormEntity.customerId, amount_vo_1.Amount.create(ormEntity.amount), ormEntity.type, ormEntity.status, transaction_signature_vo_1.TransactionSignature.create(ormEntity.signature, ormEntity.publicKey), ormEntity.timestamp, ormEntity.metadata || {}, ormEntity.previousHash, ormEntity.hash);
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_orm_entity_1.TransactionOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map