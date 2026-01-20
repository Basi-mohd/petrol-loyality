"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const employee_controller_1 = require("../../presentation/controllers/employee/employee.controller");
const employee_login_use_case_1 = require("../../application/use-cases/employee/employee-login.use-case");
const employee_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/employee.orm-entity");
const employee_repository_1 = require("../../infrastructure/persistence/postgres/repositories/employee.repository");
const jwt_module_1 = require("../../infrastructure/security/jwt/jwt.module");
const audit_module_1 = require("../audit/audit.module");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_orm_entity_1.EmployeeOrmEntity]),
            jwt_module_1.JwtAuthModule,
            audit_module_1.AuditModule,
        ],
        controllers: [employee_controller_1.EmployeeController],
        providers: [
            employee_login_use_case_1.EmployeeLoginUseCase,
            {
                provide: 'IEmployeeRepository',
                useClass: employee_repository_1.EmployeeRepository,
            },
        ],
        exports: [employee_login_use_case_1.EmployeeLoginUseCase],
    })
], EmployeeModule);
//# sourceMappingURL=employee.module.js.map