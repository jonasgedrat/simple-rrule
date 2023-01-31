import { addMonths } from './dates/addDatesHelper'
import { ByDay, BySetPos } from './types'
import { days, isBySetPosValid, isWeekDayValid } from './validators/util'

export const getBySetPos = (
    currDate: Date,
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

    return result
}

export const eachMonthOfIntervalWithTime = (
    startDate: Date,
    endDate: Date,
    byMonthDay: number = 0,
    maxCount: number = 0
) => {
    const endTime = endDate.getTime()
    const dates = []

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startDate.getTime() <= endTime)) {
        throw new RangeError('Invalid interval')
    }

    let currentDate = new Date(startDate)
    if (byMonthDay > 0 && byMonthDay <= 31) {
        currentDate.setDate(byMonthDay)
    }

    let count = 0

    while (currentDate.getTime() <= endTime) {
        if (currentDate.getTime() >= startDate.getTime()) {
            dates.push(currentDate)
        }

        count++

        if (maxCount > 0 && count >= maxCount) {
            break
        }

        currentDate = addMonths(startDate, count)
    }

    return dates
}

export const eachYearOfIntervalWithTime = (
    startDate: Date,
    endDate: Date,
    byMonthDay: number = 0
) => {
    const endTime = endDate.getTime()
    const dates = []

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startDate.getTime() <= endTime)) {
        throw new RangeError('Invalid interval')
    }

    let currentDate = startDate
    if (byMonthDay > 0 && byMonthDay <= 31) {
        currentDate.setDate(byMonthDay)
    }
    let count = 0

    while (currentDate.getTime() <= endTime) {
        if (currentDate.getTime() >= startDate.getTime()) {
            dates.push(currentDate)
        }
        count++

        currentDate = addMonths(startDate, count * 12)
    }

    return dates
}
