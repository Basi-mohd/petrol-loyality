"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_controller_1 = require("../../presentation/controllers/customer/customer.controller");
const regenerate_qr_identity_use_case_1 = require("../../application/use-cases/customer/regenerate-qr-identity.use-case");
const qr_identity_service_1 = require("../../infrastructure/services/qr-identity/qr-identity.service");
const customer_qr_identity_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/customer-qr-identity.orm-entity");
const customer_qr_identity_repository_1 = require("../../infrastructure/persistence/postgres/repositories/customer-qr-identity.repository");
const customer_orm_entity_1 = require("../../infrastructure/persistence/postgres/entities/customer.orm-entity");
const customer_repository_1 = require("../../infrastructure/persistence/postgres/repositories/customer.repository");
const jwt_module_1 = require("../../infrastructure/security/jwt/jwt.module");
let CustomerModule = class CustomerModule {
};
exports.CustomerModule = CustomerModule;
exports.CustomerModule = CustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                customer_qr_identity_orm_entity_1.CustomerQrIdentityOrmEntity,
                customer_orm_entity_1.CustomerOrmEntity,
            ]),
            jwt_module_1.JwtAuthModule,
        ],
        controllers: [customer_controller_1.CustomerController],
        providers: [
            regenerate_qr_identity_use_case_1.RegenerateQrIdentityUseCase,
            qr_identity_service_1.QrIdentityService,
            {
                provide: 'ICustomerQrIdentityRepository',
                useClass: customer_qr_identity_repository_1.CustomerQrIdentityRepository,
            },
            customer_repository_1.CustomerRepository,
            {
                provide: 'ICustomerRepository',
                useClass: customer_repository_1.CustomerRepository,
            },
        ],
        exports: [qr_identity_service_1.QrIdentityService],
    })
], CustomerModule);
//# sourceMappingURL=customer.module.js.map