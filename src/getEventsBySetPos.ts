import { isBefore } from 'date-fns'
import { IRuleExtended } from './validators/rRule'
import { days, isBySetPosValid, isWeekDayValid } from './validators/util'

export const getBySetPos = (
    firstDayOfMonth: Date,
    r: IRuleExtended,
    count: number
): Date | undefined => {
    if (r.count > 0 && count === r.count) return undefined

    if (!isWeekDayValid(r.byDay) && !isBySetPosValid(r.bySetPos)) {
        return undefined
    }

    const month = firstDayOfMonth.getMonth()
    const weekDaysInMonth = []
    const weekDayIndex = days.findIndex((x) => x === r.byDay)

    //find the first WeekDay in month
    while (firstDayOfMonth.getDay() !== weekDayIndex) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
    }

    //get array of all WeekDays / month
    while (firstDayOfMonth.getMonth() === month) {
        weekDaysInMonth.push(new Date(firstDayOfMonth.getTime()))
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 7)
    }

    const result =
        r.bySetPos === -1
            ? weekDaysInMonth.slice(-1)[0] //last WeekDay in month
            : weekDaysInMonth[r.bySetPos - 1]

    if (isBefore(result, r.dtStart)) return undefined
    if (isBefore(r.endRangePeriodOrUntil, result)) return undefined

    return result
}
