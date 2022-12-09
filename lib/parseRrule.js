"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRecurrenceFromString = void 0;
const date_fns_1 = require("date-fns");
const lodash_1 = require("lodash");
const numbers_1 = require("./numbers");
const types_1 = require("./types");
const parseRRule = (rRuleString = '', weekStartsOn) => {
    if (rRuleString === '')
        return undefined;
    const fields = rRuleString.split(':')[1].split(';');
    let result = {};
    let _v = undefined;
    fields.map((field) => {
        const value = (0, lodash_1.trim)(field.split('=')[1]);
        switch (field.split('=')[0]) {
            case types_1.rRuleFields.frequency:
                result.frequency = value;
                break;
            case types_1.rRuleFields.weekStartOn:
                result.weekStartOn = value ? value : weekStartsOn;
                break;
            case types_1.rRuleFields.interval:
                result.interval = parseInt(value);
                break;
            case types_1.rRuleFields.count:
                result.count = parseInt(value);
                break;
            case types_1.rRuleFields.until:
                result.until = (0, date_fns_1.parseISO)(value);
                break;
            case types_1.rRuleFields.byMinute:
                _v = (0, numbers_1.isBetween)(value, 0, 59);
                if (_v) {
                    result.byMinute = _v;
                }
                _v = undefined;
                break;
            case types_1.rRuleFields.byHour:
                _v = (0, numbers_1.isBetween)(value, 0, 23);
                if (_v) {
                    result.byHour = _v;
                }
                _v = undefined;
                break;
            case types_1.rRuleFields.byDay:
                result.byDay = value;
                _v = undefined;
                break;
            case types_1.rRuleFields.byMonthDay:
                _v = (0, numbers_1.isBetween)(value, 1, 31);
                if (_v) {
                    result.byMonthDay = _v;
                }
                _v = undefined;
                break;
            case types_1.rRuleFields.byYearDay:
                _v = (0, numbers_1.isBetween)(value, 1, 365);
                if (_v) {
                    result.byYearDay = _v;
                }
                _v = undefined;
                break;
            case types_1.rRuleFields.byMonth:
                _v = (0, numbers_1.isBetween)(value, 1, 12);
                if (_v) {
                    result.byMonth = _v;
                }
                _v = undefined;
                break;
            case types_1.rRuleFields.bySetPos:
                _v = (0, numbers_1.isBetween)(value, 1, 365);
                if (_v) {
                    result.bySetPos = _v;
                }
                _v = undefined;
                break;
            default:
                break;
        }
        return null;
    });
    if (result.frequency === undefined ||
        (result.count !== undefined && result.until)) {
        return undefined;
    }
    if (result.weekStartOn === undefined) {
        result.weekStartOn = weekStartsOn;
    }
    if (!result.interval) {
        result.interval = 1;
    }
    return result;
};
const parseRecurrenceFromString = (recurrenceString = '', weekStartsOn) => {
    if ((0, lodash_1.trim)(recurrenceString) === '')
        return undefined;
    const lines = recurrenceString.split('\n');
    let result = types_1.rRuleDefault;
    lines.map((line) => {
        const lineKey = (0, lodash_1.trim)(line.split(':')[0]);
        const lineValue = (0, lodash_1.trim)(line.split(':')[1]);
        if (lineKey === types_1.rRuleFields.dtStart) {
            const dtStart = (0, date_fns_1.parseISO)(lineValue);
            if (dtStart) {
                result.dtStart = dtStart;
            }
        }
        if (lineKey === types_1.rRuleFields.dtEnd) {
            const dtEnd = (0, date_fns_1.parseISO)(lineValue);
            if (dtEnd) {
                result.dtEnd = dtEnd;
            }
        }
        if (lineKey === types_1.rRuleFields.RRule) {
            const _parseRRule = parseRRule(line, weekStartsOn);
            result = Object.assign(Object.assign({}, result), _parseRRule);
        }
        return true;
    });
    return result;
};
exports.parseRecurrenceFromString = parseRecurrenceFromString;
