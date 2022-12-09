"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBetween = void 0;
const isBetween = (value, start, end) => {
    const _v = Number(value);
    if ((_v - start) * (_v - end) <= 0) {
        return _v;
    }
    return undefined;
};
exports.isBetween = isBetween;
