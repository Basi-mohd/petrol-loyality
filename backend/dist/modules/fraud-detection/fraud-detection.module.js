"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionModule = void 0;
const common_1 = require("@nestjs/common");
const fraud_detection_module_1 = require("../../infrastructure/fraud-detection/fraud-detection.module");
let FraudDetectionModule = class FraudDetectionModule {
};
exports.FraudDetectionModule = FraudDetectionModule;
exports.FraudDetectionModule = FraudDetectionModule = __decorate([
    (0, common_1.Module)({
        imports: [fraud_detection_module_1.FraudDetectionModule],
        exports: [fraud_detection_module_1.FraudDetectionModule],
    })
], FraudDetectionModule);
//# sourceMappingURL=fraud-detection.module.js.map