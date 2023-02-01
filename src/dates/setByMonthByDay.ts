import { MonthDays, YearMonths } from './../types'

export const setByMonth = (date: Date, month: YearMonths | number): Date => {
    if (month < 1 || month > 12) {
        console.error(`setByMonth invalid month , must be 1 to 12: `, month)
        //throw new RangeError('setByMonth invalid month , must be 1 to 12')
    }
    date.setMonth(month - 1)
    return date
}

export const setByDay = (date: Date, day: MonthDays | number): Date => {
    if (day < 1 || day > 31) {
        console.error(`setByDay invalid day , must be 1 to 31: `, day)
        //throw new RangeError('setByDay invalid day , must be 1 to 31')
    }
    date.setDate(day)
    return date
}
