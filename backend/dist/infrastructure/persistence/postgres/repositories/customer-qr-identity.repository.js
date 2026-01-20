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
exports.CustomerQrIdentityRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_qr_identity_entity_1 = require("../../../../domain/entities/customer-qr-identity.entity");
const customer_qr_identity_orm_entity_1 = require("../entities/customer-qr-identity.orm-entity");
let CustomerQrIdentityRepository = class CustomerQrIdentityRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async save(identity) {
        const ormEntity = this.toOrmEntity(identity);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByQrToken(qrToken) {
        const ormEntity = await this.ormRepository.findOne({ where: { qrToken } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByCustomerId(customerId) {
        const ormEntities = await this.ormRepository.find({
            where: { customerId },
            order: { createdAt: 'DESC' },
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async findActiveByCustomerId(customerId) {
        const ormEntity = await this.ormRepository.findOne({
            where: { customerId, isActive: true },
            order: { createdAt: 'DESC' },
        });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async deactivateAllForCustomer(customerId) {
        await this.ormRepository.update({ customerId, isActive: true }, { isActive: false });
    }
    toOrmEntity(identity) {
        const entity = new customer_qr_identity_orm_entity_1.CustomerQrIdentityOrmEntity();
        entity.id = identity.id;
        entity.customerId = identity.customerId;
        entity.qrToken = identity.qrToken;
        entity.isActive = identity.isActive;
        entity.createdAt = identity.createdAt;
        entity.expiresAt = identity.expiresAt;
        return entity;
    }
    toDomainEntity(ormEntity) {
        return customer_qr_identity_entity_1.CustomerQrIdentity.reconstruct(ormEntity.id, ormEntity.customerId, ormEntity.qrToken, ormEntity.isActive, ormEntity.createdAt, ormEntity.expiresAt);
    }
};
exports.CustomerQrIdentityRepository = CustomerQrIdentityRepository;
exports.CustomerQrIdentityRepository = CustomerQrIdentityRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_qr_identity_orm_entity_1.CustomerQrIdentityOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerQrIdentityRepository);
//# sourceMappingURL=customer-qr-identity.repository.js.map