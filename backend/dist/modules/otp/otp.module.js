"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const otp_controller_1 = require("../../presentation/controllers/otp/otp.controller");
const otp_service_1 = require("../../infrastructure/services/otp/otp.service");
const request_otp_use_case_1 = require("../../application/use-cases/otp/request-otp.use-case");
const verify_otp_use_case_1 = require("../../application/use-cases/otp/verify-otp.use-case");
const otp_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/otp.orm-entity");
const device_binding_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/device-binding.orm-entity");
const otp_repository_1 = require("../../infrastructure/persistence/postgres/repositories/otp.repository");
const device_binding_repository_1 = require("../../infrastructure/persistence/postgres/repositories/device-binding.repository");
const sms_module_1 = require("../../infrastructure/external/sms/sms.module");
const customer_repository_1 = require("../../infrastructure/persistence/postgres/repositories/customer.repository");
const customer_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/customer.orm-entity");
const qr_identity_service_1 = require("../../infrastructure/services/qr-identity/qr-identity.service");
const customer_qr_identity_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/customer-qr-identity.orm-entity");
const customer_qr_identity_repository_1 = require("../../infrastructure/persistence/postgres/repositories/customer-qr-identity.repository");
const jwt_module_1 = require("../../infrastructure/security/jwt/jwt.module");
const cache_module_1 = require("../../infrastructure/persistence/redis/cache.module");
const audit_module_1 = require("../audit/audit.module");
const audit_service_1 = require("../../infrastructure/audit/audit.service");
let OtpModule = class OtpModule {
};
exports.OtpModule = OtpModule;
exports.OtpModule = OtpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                otp_orm_entity_1.OtpOrmEntity,
                device_binding_orm_entity_1.DeviceBindingOrmEntity,
                customer_orm_entity_1.CustomerOrmEntity,
                customer_qr_identity_orm_entity_1.CustomerQrIdentityOrmEntity,
            ]),
            config_1.ConfigModule,
            sms_module_1.SmsModule,
            jwt_module_1.JwtAuthModule,
            cache_module_1.CacheModuleRedis,
            audit_module_1.AuditModule,
        ],
        controllers: [otp_controller_1.OtpController],
        providers: [
            otp_service_1.OtpService,
            request_otp_use_case_1.RequestOtpUseCase,
            verify_otp_use_case_1.VerifyOtpUseCase,
            {
                provide: 'IOtpRepository',
                useClass: otp_repository_1.OtpRepository,
            },
            {
                provide: 'IDeviceBindingRepository',
                useClass: device_binding_repository_1.DeviceBindingRepository,
            },
            customer_repository_1.CustomerRepository,
            {
                provide: 'ICustomerRepository',
                useClass: customer_repository_1.CustomerRepository,
            },
            qr_identity_service_1.QrIdentityService,
            {
                provide: 'ICustomerQrIdentityRepository',
                useClass: customer_qr_identity_repository_1.CustomerQrIdentityRepository,
            },
            audit_service_1.AuditService,
        ],
        exports: [otp_service_1.OtpService, qr_identity_service_1.QrIdentityService],
    })
], OtpModule);
//# sourceMappingURL=otp.module.js.map