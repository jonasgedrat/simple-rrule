"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRRuleString = void 0;
const rRuleDateStringFormat_1 = require("./rRuleDateStringFormat");
const types_1 = require("./types");
const getRRuleString = (f) => {
    if (f.frequency === types_1.Frequency.NEVER) {
        return '';
    }
    //console.log('serializeRule rRule', f)
    let rRuleString = `${types_1.rRuleFields.frequency}=${f.frequency.toUpperCase()}`;
    const start = `${types_1.rRuleFields.dtStart}:${(0, rRuleDateStringFormat_1.toRRuleDateString)(f.dtStart)}`;
    const end = `${types_1.rRuleFields.dtEnd}:${(0, rRuleDateStringFormat_1.toRRuleDateString)(f.dtEnd)}\n`;
    rRuleString += `;${types_1.rRuleFields.interval}=${f.interval || 1}`;
    if (f.count > 0) {
        rRuleString += `;${types_1.rRuleFields.count}=${f.count}`;
    }
    if (f.until) {
        rRuleString += `;${types_1.rRuleFields.until}=${(0, rRuleDateStringFormat_1.toRRuleDateString)(f.until)}`;
    }
    if (f.frequency === types_1.Frequency.YEARLY && f.byMonth > 0) {
        rRuleString += `;${types_1.rRuleFields.byMonth}=${f.byMonth}`;
    }
    if (f.frequency === types_1.Frequency.MONTHLY && f.byMonthDay > 0) {
        rRuleString += `;${types_1.rRuleFields.byMonthDay}=${f.byMonthDay}`;
    }
    if (f.bySetPos !== 0) {
        rRuleString += `;${types_1.rRuleFields.bySetPos}=${f.bySetPos}`;
    }
    if (f.byDay !== '') {
        rRuleString += `;${types_1.rRuleFields.byDay}=${f.byDay}`;
    }
    if (f.wkst) {
        rRuleString += `;${types_1.rRuleFields.weekStartOn}=${f.wkst}`;
    }
    rRuleString = `${start}\n${end}${types_1.rRuleFields.RRule}:${rRuleString}`;
    return rRuleString;
};
exports.getRRuleString = getRRuleString;
