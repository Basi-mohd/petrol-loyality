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
exports.DailyReconciliationUseCase = void 0;
const common_1 = require("@nestjs/common");
const date_utils_1 = require("../../../shared/utils/date.utils");
let DailyReconciliationUseCase = class DailyReconciliationUseCase {
    constructor(reconciliationService) {
        this.reconciliationService = reconciliationService;
    }
    async execute(date) {
        const targetDate = date || new Date();
        const startDate = date_utils_1.DateUtils.startOfDay(targetDate);
        const endDate = date_utils_1.DateUtils.endOfDay(targetDate);
        return this.reconciliationService.reconcile(startDate, endDate);
    }
};
exports.DailyReconciliationUseCase = DailyReconciliationUseCase;
exports.DailyReconciliationUseCase = DailyReconciliationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IReconciliationService')),
    __metadata("design:paramtypes", [Object])
], DailyReconciliationUseCase);
//# sourceMappingURL=daily-reconciliation.use-case.js.map