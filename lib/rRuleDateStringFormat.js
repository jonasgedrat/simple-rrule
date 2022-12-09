"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromRruleDateStringToDate = exports.toRRuleDateString = void 0;
const toRRuleDateString = function (_date, utc = true) {
    return [
        _date.getUTCFullYear().toString().padStart(4, '0'),
        (_date.getUTCMonth() + 1).toString().padStart(2, '0'),
        _date.getUTCDate().toString().padStart(2, '0'),
        'T',
        _date.getUTCHours().toString().padStart(2, '0'),
        _date.getUTCMinutes().toString().padStart(2, '0'),
        _date.getUTCSeconds().toString().padStart(2, '0'),
        utc ? 'Z' : '',
    ].join('');
};
exports.toRRuleDateString = toRRuleDateString;
const fromRruleDateStringToDate = function (until) {
    const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
    const bits = re.exec(until);
    if (!bits)
        throw new Error(`Invalid UNTIL value: ${until}`);
    return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
};
exports.fromRruleDateStringToDate = fromRruleDateStringToDate;
