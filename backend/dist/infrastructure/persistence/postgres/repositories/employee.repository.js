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
exports.EmployeeRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../../../../domain/entities/employee.entity");
const employee_orm_entity_1 = require("../entities/employee.orm-entity");
let EmployeeRepository = class EmployeeRepository {
    constructor(ormRepository) {
        this.ormRepository = ormRepository;
    }
    async save(employee) {
        const ormEntity = this.toOrmEntity(employee);
        await this.ormRepository.save(ormEntity);
    }
    async findById(id) {
        const ormEntity = await this.ormRepository.findOne({ where: { id } });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    async findByEmployeeId(employeeId) {
        const ormEntity = await this.ormRepository.findOne({
            where: { employeeId },
        });
        return ormEntity ? this.toDomainEntity(ormEntity) : null;
    }
    toOrmEntity(employee) {
        const ormEntity = new employee_orm_entity_1.EmployeeOrmEntity();
        ormEntity.id = employee.id;
        ormEntity.employeeId = employee.employeeId;
        ormEntity.passwordHash = employee.passwordHash;
        ormEntity.name = employee.name;
        ormEntity.isActive = employee.isActive;
        ormEntity.createdAt = employee.createdAt;
        ormEntity.updatedAt = employee.updatedAt;
        return ormEntity;
    }
    toDomainEntity(ormEntity) {
        return employee_entity_1.Employee.reconstruct(ormEntity.id, ormEntity.employeeId, ormEntity.passwordHash, ormEntity.name, ormEntity.isActive, ormEntity.createdAt, ormEntity.updatedAt);
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_orm_entity_1.EmployeeOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeRepository);
//# sourceMappingURL=employee.repository.js.map