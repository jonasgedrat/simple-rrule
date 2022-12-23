import { ByDay, BySetPos } from './types'
import { addMonths } from 'date-fns'
import { days, isBySetPosValid, isWeekDayValid } from './validators/util'

export const getBySetPos = (
    currDate: Date,
    // dtStart: Date,
    // endRangePeriodOrUntil: Date,
    byDay: ByDay,
    bySetPos: BySetPos,
    maxCount: number,
    currentCount: number
): Date | undefined => {
    if (maxCount > 0 && currentCount === maxCount) return undefined

    if (!isWeekDayValid(byDay) && !isBySetPosValid(bySetPos)) {
        return undefined
    }

    const firstDayOfMonth = currDate
    firstDayOfMonth.setHours(0, 0, 0, 0)
    firstDayOfMonth.setDate(1)

    const month = firstDayOfMonth.getMonth()
    const weekDaysInMonth = []
    const weekDayIndex = days.findIndex((x) => x === byDay)

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
        bySetPos === -1
            ? weekDaysInMonth.slice(-1)[0] //last WeekDay in month
            : weekDaysInMonth[bySetPos - 1]

    // if (isBefore(result, dtStart)) return undefined
    // if (isBefore(endRangePeriodOrUntil, result)) return undefined

    return result
}

export const eachMonthOfIntervalWithTime = (startDate: Date, endDate: Date) => {
    const endTime = endDate.getTime()
    const dates = []

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startDate.getTime() <= endTime)) {
        throw new RangeError('Invalid interval')
    }

    let currentDate = startDate
    let count = 0

    while (currentDate.getTime() <= endTime) {
        dates.push(currentDate)
        count++
        currentDate = addMonths(startDate, count)
    }

    return dates
}
