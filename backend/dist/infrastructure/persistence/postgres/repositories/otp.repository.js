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
exports.OtpRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const otp_entity_1 = require("../../../../domain/entities/otp.entity");
const otp_orm_entity_1 = require("../entities/otp.orm-entity");
let OtpRepository = class OtpRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async save(otp) {
        const ormEntity = this.toOrmEntity(otp);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findLatestByPhoneAndDevice(phoneNumber, deviceId) {
        const ormEntity = await this.ormRepository.findOne({
            where: { phoneNumber, deviceId },
            order: { createdAt: 'DESC' },
        });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findRecentByPhone(phoneNumber, minutes) {
        const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
        const ormEntities = await this.ormRepository.find({
            where: {
                phoneNumber,
                createdAt: (0, typeorm_2.MoreThan)(cutoffTime),
            },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return ormEntities.map((entity) => this.toDomainEntity(entity));
    }
    async deleteExpired() {
        await this.ormRepository.delete({
            expiresAt: (0, typeorm_2.LessThan)(new Date()),
        });
    }
    toOrmEntity(otp) {
        const entity = new otp_orm_entity_1.OtpOrmEntity();
        entity.id = otp.id;
        entity.phoneNumber = otp.phoneNumber;
        entity.code = otp.code;
        entity.deviceId = otp.deviceId;
        entity.expiresAt = otp.expiresAt;
        entity.createdAt = otp.createdAt;
        entity.verifiedAt = otp.verifiedAt;
        entity.attempts = otp.attempts;
        entity.isVerified = otp.isVerified;
        return entity;
    }
    toDomainEntity(ormEntity) {
        return otp_entity_1.Otp.reconstruct(ormEntity.id, ormEntity.phoneNumber, ormEntity.code, ormEntity.deviceId, ormEntity.expiresAt, ormEntity.createdAt, ormEntity.verifiedAt, ormEntity.attempts, ormEntity.isVerified);
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_orm_entity_1.OtpOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OtpRepository);
//# sourceMappingURL=otp.repository.js.map