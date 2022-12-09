"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rRuleFields = exports.rRuleDefault = exports.Weekday = exports.Frequency = void 0;
const date_fns_1 = require("date-fns");
var Frequency;
(function (Frequency) {
    Frequency["NEVER"] = "NEVER";
    Frequency["YEARLY"] = "YEARLY";
    Frequency["MONTHLY"] = "MONTHLY";
    Frequency["WEEKLY"] = "WEEKLY";
    Frequency["DAILY"] = "DAILY";
    Frequency["HOURLY"] = "HOURLY";
    Frequency["MINUTELY"] = "MINUTELY";
    Frequency["SECONDLY"] = "SECONDLY";
})(Frequency = exports.Frequency || (exports.Frequency = {}));
var Weekday;
(function (Weekday) {
    Weekday["Sunday"] = "SU";
    Weekday["Monday"] = "MO";
    Weekday["Tuesday"] = "TU";
    Weekday["Wednesday"] = "WE";
    Weekday["Thursday"] = "TH";
    Weekday["Friday"] = "FR";
    Weekday["Saturday"] = "SA";
})(Weekday = exports.Weekday || (exports.Weekday = {}));
exports.rRuleDefault = {
    frequency: Frequency.NEVER,
    dtStart: new Date(),
    dtEnd: (0, date_fns_1.addMinutes)(new Date(), 60),
    weekStartOn: Weekday.Sunday,
    interval: 1,
    count: undefined,
    until: undefined,
    bySetPos: undefined,
    bySecond: undefined,
    byMinute: undefined,
    byHour: undefined,
    byDay: undefined,
    byMonth: undefined,
    byMonthDay: undefined,
    byYearDay: undefined,
};
exports.rRuleFields = {
    RRule: 'RRULE',
    frequency: 'FREQ',
    dtStart: 'DTSTART',
    dtEnd: 'DTEND',
    weekStartOn: 'WKST',
    interval: 'INTERVAL',
    count: 'COUNT',
    until: 'UNTIL',
    bySetPos: 'BYSETPOS',
    byMinute: 'BYMINUTE',
    byHour: 'BYHOUR',
    byDay: 'BYDAY',
    byMonthDay: 'BYMONTHDAY',
    byMonth: 'BYMONTH',
    byYearDay: 'BYEARDAY',
};
