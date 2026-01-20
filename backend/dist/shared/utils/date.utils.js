"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
class DateUtils {
    static startOfDay(date = new Date()) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
    static endOfDay(date = new Date()) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    }
    static toISOString(date) {
        return date.toISOString();
    }
    static fromISOString(isoString) {
        return new Date(isoString);
    }
}
exports.DateUtils = DateUtils;
//# sourceMappingURL=date.utils.js.map