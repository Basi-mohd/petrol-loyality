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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceBindingOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let DeviceBindingOrmEntity = class DeviceBindingOrmEntity {
};
exports.DeviceBindingOrmEntity = DeviceBindingOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], DeviceBindingOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20 }),
    __metadata("design:type", String)
], DeviceBindingOrmEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata("design:type", String)
], DeviceBindingOrmEntity.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255, nullable: true }),
    __metadata("design:type", String)
], DeviceBindingOrmEntity.prototype, "deviceFingerprint", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], DeviceBindingOrmEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceBindingOrmEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceBindingOrmEntity.prototype, "updatedAt", void 0);
exports.DeviceBindingOrmEntity = DeviceBindingOrmEntity = __decorate([
    (0, typeorm_1.Entity)('device_bindings'),
    (0, typeorm_1.Index)(['phoneNumber', 'deviceId'], { unique: true })
], DeviceBindingOrmEntity);
//# sourceMappingURL=device-binding.orm-entity.js.map