"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWeekDay = void 0;
const types_1 = require("./types");
const parseWeekDay = (weekDay) => {
    let result = 0;
    switch (weekDay) {
        case types_1.Weekday.Sunday:
            result = 0;
            break;
        case types_1.Weekday.Monday:
            result = 1;
            break;
        case types_1.Weekday.Tuesday:
            result = 2;
            break;
        case types_1.Weekday.Wednesday:
            result = 3;
            break;
        case types_1.Weekday.Thursday:
            result = 4;
            break;
        case types_1.Weekday.Friday:
            result = 5;
            break;
        case types_1.Weekday.Saturday:
            result = 6;
            break;
        default:
            result = 0;
    }
    return result;
};
exports.parseWeekDay = parseWeekDay;
