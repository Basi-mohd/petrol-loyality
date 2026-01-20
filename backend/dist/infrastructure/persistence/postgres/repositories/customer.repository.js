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
exports.CustomerRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../../../../domain/entities/customer.entity");
const customer_orm_entity_1 = require("../entities/customer.orm-entity");
const phone_number_vo_1 = require("../../../../domain/value-objects/phone-number.vo");
const amount_vo_1 = require("../../../../domain/value-objects/amount.vo");
let CustomerRepository = class CustomerRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async save(customer) {
        const ormEntity = this.toOrmEntity(customer);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByPhoneNumber(phoneNumber) {
        const ormEntity = await this.ormRepository.findOne({
            where: { phoneNumber: phoneNumber.getCleaned() },
        });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findAll() {
        const ormEntities = await this.ormRepository.find();
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async update(customer) {
        await this.save(customer);
    }
    toOrmEntity(customer) {
        const entity = new customer_orm_entity_1.CustomerOrmEntity();
        entity.id = customer.id;
        entity.phoneNumber = customer.phoneNumber.getCleaned();
        entity.name = customer.name;
        entity.balance = customer.balance.getValue();
        entity.isActive = customer.isActive;
        entity.createdAt = customer.createdAt;
        entity.updatedAt = customer.updatedAt;
        return entity;
    }
    toDomainEntity(ormEntity) {
        const balanceValue = typeof ormEntity.balance === 'string'
            ? parseFloat(ormEntity.balance)
            : Number(ormEntity.balance);
        return customer_entity_1.Customer.reconstruct(ormEntity.id, phone_number_vo_1.PhoneNumber.create(ormEntity.phoneNumber), ormEntity.name, amount_vo_1.Amount.create(balanceValue), ormEntity.createdAt, ormEntity.updatedAt, ormEntity.isActive);
    }
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_orm_entity_1.CustomerOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerRepository);
//# sourceMappingURL=customer.repository.js.map