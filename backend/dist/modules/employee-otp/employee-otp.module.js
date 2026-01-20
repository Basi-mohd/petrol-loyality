"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeOtpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const employee_otp_controller_1 = require("../../presentation/controllers/employee-otp/employee-otp.controller");
const otp_service_1 = require("../../infrastructure/services/otp/otp.service");
const request_employee_otp_use_case_1 = require("../../application/use-cases/employee-otp/request-employee-otp.use-case");
const verify_employee_otp_use_case_1 = require("../../application/use-cases/employee-otp/verify-employee-otp.use-case");
const otp_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/otp.orm-entity");
const device_binding_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/device-binding.orm-entity");
const otp_repository_1 = require("../../infrastructure/persistence/postgres/repositories/otp.repository");
const device_binding_repository_1 = require("../../infrastructure/persistence/postgres/repositories/device-binding.repository");
const sms_module_1 = require("../../infrastructure/external/sms/sms.module");
const jwt_module_1 = require("../../infrastructure/security/jwt/jwt.module");
const cache_module_1 = require("../../infrastructure/persistence/redis/cache.module");
const audit_module_1 = require("../audit/audit.module");
const audit_service_1 = require("../../infrastructure/audit/audit.service");
let EmployeeOtpModule = class EmployeeOtpModule {
};
exports.EmployeeOtpModule = EmployeeOtpModule;
exports.EmployeeOtpModule = EmployeeOtpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                otp_orm_entity_1.OtpOrmEntity,
                device_binding_orm_entity_1.DeviceBindingOrmEntity,
            ]),
            config_1.ConfigModule,
            sms_module_1.SmsModule,
            jwt_module_1.JwtAuthModule,
            cache_module_1.CacheModuleRedis,
            audit_module_1.AuditModule,
        ],
        controllers: [employee_otp_controller_1.EmployeeOtpController],
        providers: [
            otp_service_1.OtpService,
            request_employee_otp_use_case_1.RequestEmployeeOtpUseCase,
            verify_employee_otp_use_case_1.VerifyEmployeeOtpUseCase,
            {
                provide: 'IOtpRepository',
                useClass: otp_repository_1.OtpRepository,
            },
            {
                provide: 'IDeviceBindingRepository',
                useClass: device_binding_repository_1.DeviceBindingRepository,
            },
            audit_service_1.AuditService,
        ],
        exports: [otp_service_1.OtpService],
    })
], EmployeeOtpModule);
//# sourceMappingURL=employee-otp.module.js.map