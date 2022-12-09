"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandRRule = void 0;
const date_fns_1 = require("date-fns");
const types_1 = require("./types");
const expandRRule = (rRule, startRangePeriod, endRangePeriod, minimalSecondsDuration = 60 * 5 //5 minutos
) => {
    //ajustar todas as datas para UTC time zone 000 antes de qualquer coisa
    //console.log(rRule)
    const r = validateAndAdjustRRule(rRule, startRangePeriod, endRangePeriod, minimalSecondsDuration);
    if (r.hasErrors) {
        return {
            r: r,
            events: [],
        };
    }
    const result = {
        r: r,
        events: getEventsByFrequency(r),
    };
    // console.log(result)
    return result;
};
exports.expandRRule = expandRRule;
const getEventsByFrequency = (r) => {
    var _a;
    let dates = [];
    if ((0, date_fns_1.isBefore)(r.endRangePeriodOrUntil, r.firstEventInRangePeriod))
        return [];
    const interval = {
        start: r.firstEventInRangePeriod,
        end: r.endRangePeriodOrUntil,
    };
    const step = {
        step: r.frequency === types_1.Frequency.WEEKLY ? r.interval * 7 : r.interval,
    };
    switch (r.frequency) {
        case types_1.Frequency.SECONDLY:
            //nao implementado
            break;
        case types_1.Frequency.MINUTELY:
            dates = (0, date_fns_1.eachMinuteOfInterval)(interval, step);
            break;
        case types_1.Frequency.HOURLY:
            dates = (0, date_fns_1.eachHourOfInterval)(interval, step);
            break;
        case types_1.Frequency.DAILY:
            dates = (0, date_fns_1.eachDayOfInterval)(interval, step);
            break;
        case types_1.Frequency.WEEKLY:
            if (r.byDay && r.byDay.length > 0) {
                let resultWeekly = [];
                const weekDays = (_a = r.byDay) === null || _a === void 0 ? void 0 : _a.split(',');
                r.startIndexCount = r.startIndexCount * weekDays.length;
                const eachDay = (0, date_fns_1.eachDayOfInterval)(interval, {
                    step: r.interval,
                });
                eachDay.map((day) => {
                    const dayOfWeek = (0, date_fns_1.format)(day, 'EEEEEE').toLocaleUpperCase();
                    if (weekDays === null || weekDays === void 0 ? void 0 : weekDays.includes(dayOfWeek)) {
                        resultWeekly.push(day);
                    }
                    return undefined;
                });
                dates = resultWeekly;
            }
            else {
                //caso nao tenha nenhum dia sa semana selecionado
                //retorna evento semanal pelo dia da DTSTART
                dates = (0, date_fns_1.eachDayOfInterval)(interval, step);
            }
            break;
        case types_1.Frequency.MONTHLY:
            if (r.byMonthDay && r.byMonthDay > 0) {
                dates = (0, date_fns_1.eachMonthOfInterval)(interval);
                dates = dates.map((x) => (0, date_fns_1.setDate)(x, r === null || r === void 0 ? void 0 : r.byMonthDay));
                break;
            }
            dates = (0, date_fns_1.eachMonthOfInterval)(interval);
            break;
        case types_1.Frequency.YEARLY:
            console.log('yearly interval', interval);
            dates = (0, date_fns_1.eachYearOfInterval)(interval);
            break;
        default:
    }
    const result = dates
        .map((x, i) => {
        return {
            date: x,
            index: r.startIndexCount + i + 1,
        };
    })
        .filter((y) => {
        let filterResult = false;
        filterResult = y.date >= r.startRangePeriod;
        if (r.count > 0 && y.index > r.count) {
            filterResult = false;
        }
        return filterResult;
    });
    //console.log(result)
    return result;
};
const validateAndAdjustRRule = (rRule, startRangePeriod, endRangePeriod, minimalSecondsDuration = 60 * 60 * 5) => {
    const result = Object.assign(Object.assign({}, rRule), { count: rRule.count && rRule.count > 0 ? rRule.count : 0, startRangePeriod: rRule.dtStart > startRangePeriod ? rRule.dtStart : startRangePeriod, endRangePeriodOrUntil: !!rRule.until && rRule.until < endRangePeriod
            ? rRule.until
            : endRangePeriod, secondsDuration: !rRule.dtEnd
            ? minimalSecondsDuration
            : (0, date_fns_1.differenceInSeconds)(rRule.dtEnd, rRule.dtStart), hasErrors: false, errorMessages: '', eventsCount: 0, startIndexCount: 0, firstEventInRangePeriod: rRule.dtStart });
    if (result.secondsDuration > 0 && !!rRule.until && rRule.until) {
        result.endRangePeriodOrUntil = (0, date_fns_1.addSeconds)(result.endRangePeriodOrUntil, -result.secondsDuration);
    }
    if (!rRule.dtEnd) {
        result.dtEnd = (0, date_fns_1.addSeconds)(rRule.dtStart, minimalSecondsDuration);
    }
    else if (rRule.dtStart > rRule.dtEnd) {
        result.hasErrors = true;
        result.errorMessages +=
            `\nInvalid recurrence rule: Start date (${rRule.dtStart})` +
                `is greater than End date ${rRule.dtStart}`;
    }
    //limitar se tiver until
    if (!!rRule.until && rRule.until < result.startRangePeriod) {
        result.hasErrors = true;
        result.errorMessages +=
            `\nInvalid recurrence rule: _startRangePeriod date (${result.startRangePeriod})` +
                `is greater than until date ${rRule.until}`;
    }
    if (!result.hasErrors && result.dtStart < result.startRangePeriod) {
        const r = setStartIndexCountAndFirstEventInRangePeriod(result);
        return r;
    }
    return result;
};
const setStartIndexCountAndFirstEventInRangePeriod = (r) => {
    let result = r;
    let durationInFrequency = 0;
    let durationFromStart = 0;
    let eventCountsFromDtStart = 0;
    switch (r.frequency) {
        case types_1.Frequency.SECONDLY:
            //nao implementado
            break;
        case types_1.Frequency.MINUTELY:
            durationInFrequency = (0, date_fns_1.differenceInMinutes)(
            //final do primeiro evento
            (0, date_fns_1.addDays)(r.dtStart, r.interval), 
            //inicio do primeiro evento
            r.dtStart);
            durationFromStart = (0, date_fns_1.differenceInMinutes)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            eventCountsFromDtStart = Math.ceil(durationFromStart / durationInFrequency);
            result.firstEventInRangePeriod = (0, date_fns_1.addMinutes)(r.dtStart, eventCountsFromDtStart * r.interval);
            break;
        case types_1.Frequency.HOURLY:
            durationInFrequency = (0, date_fns_1.differenceInHours)(
            //final do primeiro evento
            (0, date_fns_1.addDays)(r.dtStart, r.interval), 
            //inicio do primeiro evento
            r.dtStart);
            durationFromStart = (0, date_fns_1.differenceInHours)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            eventCountsFromDtStart = Math.ceil(durationFromStart / durationInFrequency);
            result.firstEventInRangePeriod = (0, date_fns_1.addHours)(r.dtStart, eventCountsFromDtStart * r.interval);
            break;
        case types_1.Frequency.DAILY:
            durationInFrequency = (0, date_fns_1.differenceInDays)(
            //final do primeiro evento
            (0, date_fns_1.addDays)(r.dtStart, r.interval), 
            //inicio do primeiro evento
            r.dtStart);
            durationFromStart = (0, date_fns_1.differenceInDays)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            eventCountsFromDtStart = Math.ceil(durationFromStart / durationInFrequency);
            result.firstEventInRangePeriod = (0, date_fns_1.addDays)(r.dtStart, eventCountsFromDtStart * r.interval);
            break;
        case types_1.Frequency.WEEKLY:
            durationInFrequency = (0, date_fns_1.differenceInDays)(
            //final do primeiro evento
            (0, date_fns_1.addDays)(r.dtStart, r.interval * 7), 
            //inicio do primeiro evento
            r.dtStart);
            durationFromStart = (0, date_fns_1.differenceInWeeks)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            eventCountsFromDtStart = Math.ceil(durationFromStart / durationInFrequency);
            result.firstEventInRangePeriod = (0, date_fns_1.addDays)(r.dtStart, eventCountsFromDtStart * (r.interval * 7));
            break;
        case types_1.Frequency.MONTHLY:
            eventCountsFromDtStart = (0, date_fns_1.differenceInMonths)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            if (eventCountsFromDtStart > 0) {
                result.firstEventInRangePeriod = (0, date_fns_1.addMonths)(r.dtStart, eventCountsFromDtStart);
            }
            break;
        case types_1.Frequency.YEARLY:
            eventCountsFromDtStart = (0, date_fns_1.differenceInYears)(
            //data inicial do scheduler
            r.startRangePeriod, 
            //inicio do primeiro evento
            r.dtStart);
            if (eventCountsFromDtStart > 0) {
                result.firstEventInRangePeriod = (0, date_fns_1.addYears)(r.dtStart, eventCountsFromDtStart);
            }
            break;
        default:
    }
    if (r.count > 0 && eventCountsFromDtStart > r.count) {
        result.hasErrors = true;
        result.errorMessages += `\nInvalid recurrence rule: event is finished by count`;
        return result;
    }
    //count inicial dos eventos
    result.startIndexCount = eventCountsFromDtStart;
    // console.log('result', result)
    return result;
};
