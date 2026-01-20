"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptographyModule = void 0;
const common_1 = require("@nestjs/common");
const signature_verification_service_1 = require("./signature-verification.service");
let CryptographyModule = class CryptographyModule {
};
exports.CryptographyModule = CryptographyModule;
exports.CryptographyModule = CryptographyModule = __decorate([
    (0, common_1.Module)({
        providers: [
            signature_verification_service_1.SignatureVerificationService,
            {
                provide: 'ISignatureVerificationService',
                useClass: signature_verification_service_1.SignatureVerificationService,
            },
        ],
        exports: [signature_verification_service_1.SignatureVerificationService, 'ISignatureVerificationService'],
    })
], CryptographyModule);
//# sourceMappingURL=cryptography.module.js.map