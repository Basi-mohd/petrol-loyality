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
exports.LedgerRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("../../../../domain/entities/ledger-entry.entity");
const ledger_entry_orm_entity_1 = require("../entities/ledger-entry.orm-entity");
const ledger_hash_vo_1 = require("../../../../domain/value-objects/ledger-hash.vo");
const amount_vo_1 = require("../../../../domain/value-objects/amount.vo");
let LedgerRepository = class LedgerRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async append(entry) {
        const ormEntity = this.toOrmEntity(entry);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByTransactionId(transactionId) {
        const ormEntity = await this.ormRepository.findOne({
            where: { transactionId },
        });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByCustomerId(customerId) {
        const ormEntities = await this.ormRepository.find({
            where: { customerId },
            order: { timestamp: 'ASC' },
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async getLastEntry(customerId) {
        const query = this.ormRepository
            .createQueryBuilder('ledger')
            .orderBy('ledger.timestamp', 'DESC')
            .limit(1);
        if (customerId) {
            query.where('ledger.customerId = :customerId', { customerId });
        }
        const ormEntity = await query.getOne();
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async getLastHash(customerId) {
        const lastEntry = await this.getLastEntry(customerId);
        return lastEntry ? lastEntry.hash : null;
    }
    async verifyIntegrity() {
        const entries = await this.ormRepository.find({
            order: { timestamp: 'ASC' },
        });
        let previousHash = null;
        for (const entry of entries) {
            const domainEntry = this.toDomainEntity(entry);
            if (!domainEntry.verifyIntegrity(previousHash)) {
                return false;
            }
            previousHash = domainEntry.hash;
        }
        return true;
    }
    async findAll(limit, offset) {
        const query = this.ormRepository
            .createQueryBuilder('ledger')
            .orderBy('ledger.timestamp', 'ASC');
        if (limit) {
            query.limit(limit);
        }
        if (offset) {
            query.offset(offset);
        }
        const ormEntities = await query.getMany();
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    toOrmEntity(entry) {
        const entity = new ledger_entry_orm_entity_1.LedgerEntryOrmEntity();
        entity.id = entry.id;
        entity.transactionId = entry.transactionId;
        entity.customerId = entry.customerId;
        entity.amount = entry.amount.getValue();
        entity.type = entry.type;
        entity.previousHash = entry.previousHash?.getValue() || null;
        entity.hash = entry.hash.getValue();
        entity.timestamp = entry.timestamp;
        entity.metadata = entry.metadata;
        return entity;
    }
    toDomainEntity(ormEntity) {
        const amountValue = typeof ormEntity.amount === 'string'
            ? parseFloat(ormEntity.amount)
            : Number(ormEntity.amount);
        return ledger_entry_entity_1.LedgerEntry.reconstruct(ormEntity.id, ormEntity.transactionId, ormEntity.customerId, amount_vo_1.Amount.create(amountValue), ormEntity.type, ormEntity.previousHash
            ? ledger_hash_vo_1.LedgerHash.create(ormEntity.previousHash)
            : null, ledger_hash_vo_1.LedgerHash.create(ormEntity.hash), ormEntity.timestamp, ormEntity.metadata || {});
    }
};
exports.LedgerRepository = LedgerRepository;
exports.LedgerRepository = LedgerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entry_orm_entity_1.LedgerEntryOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LedgerRepository);
//# sourceMappingURL=ledger.repository.js.map