"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const configuration_1 = __importDefault(require("./config/configuration"));
const database_config_1 = require("./config/database.config");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const ledger_module_1 = require("./modules/ledger/ledger.module");
const auth_module_1 = require("./modules/auth/auth.module");
const fraud_detection_module_1 = require("./modules/fraud-detection/fraud-detection.module");
const reconciliation_module_1 = require("./modules/reconciliation/reconciliation.module");
const audit_module_1 = require("./modules/audit/audit.module");
const otp_module_1 = require("./modules/otp/otp.module");
const employee_otp_module_1 = require("./modules/employee-otp/employee-otp.module");
const employee_module_1 = require("./modules/employee/employee.module");
const customer_module_1 = require("./modules/customer/customer.module");
const cache_module_1 = require("./infrastructure/persistence/redis/cache.module");
const health_controller_1 = require("./presentation/controllers/health/health.controller");
const core_1 = require("@nestjs/core");
let BullMQModule = null;
if (process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost') {
    try {
        BullMQModule = require('./infrastructure/messaging/bullmq/bullmq.module').BullMQModule;
    }
    catch (error) {
        console.warn('BullMQ module not available, skipping...');
    }
}
const global_exception_filter_1 = require("./presentation/filters/global-exception.filter");
const domain_exception_filter_1 = require("./presentation/filters/domain-exception.filter");
const validation_exception_filter_1 = require("./presentation/filters/validation-exception.filter");
const logging_interceptor_1 = require("./presentation/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./presentation/interceptors/transform.interceptor");
const audit_interceptor_1 = require("./presentation/interceptors/audit.interceptor");
const validation_pipe_1 = require("./presentation/pipes/validation.pipe");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => (0, database_config_1.getDatabaseConfig)(configService),
                inject: [config_1.ConfigService],
            }),
            cache_module_1.CacheModuleRedis,
            ...(BullMQModule ? [BullMQModule] : []),
            transactions_module_1.TransactionsModule,
            ledger_module_1.LedgerModule,
            auth_module_1.AuthModule,
            fraud_detection_module_1.FraudDetectionModule,
            reconciliation_module_1.ReconciliationModule,
            audit_module_1.AuditModule,
            otp_module_1.OtpModule,
            employee_otp_module_1.EmployeeOtpModule,
            employee_module_1.EmployeeModule,
            customer_module_1.CustomerModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: global_exception_filter_1.GlobalExceptionFilter,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: domain_exception_filter_1.DomainExceptionFilter,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: validation_exception_filter_1.ValidationExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: validation_pipe_1.ValidationPipe,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map