import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addWeeks,
    addYears,
} from './addDatesHelper'

export const eachDateOfInterval = (
    startDate: Date,
    endDate: Date,
    dateUnitType:
        | 'milliseconds'
        | 'seconds'
        | 'minutes'
        | 'hours'
        | 'days'
        | 'weeks'
        | 'months'
        | 'years',
    step: number = 1,
    maxCount: number = 0
): Date[] => {
    const endTime = endDate.getTime()
    const dates = []

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startDate.getTime() <= endTime)) {
        throw new RangeError('Invalid interval')
    }

    let currentDate = new Date(startDate)
    let count = 0

    while (currentDate.getTime() <= endTime) {
        if (currentDate.getTime() >= startDate.getTime()) {
            dates.push(currentDate)
        }
        count++

        if (maxCount > 0 && count >= maxCount) {
            break
        }

        switch (dateUnitType) {
            case 'seconds':
                currentDate = addSeconds(startDate, count * step)
                break
            case 'minutes':
                currentDate = addMinutes(startDate, count * step)
                break
            case 'hours':
                currentDate = addHours(startDate, count * step)
                break
            case 'days':
                currentDate = addDays(startDate, count * step)
                break
            case 'weeks':
                currentDate = addWeeks(startDate, count * step)
                break
            case 'months':
                currentDate = addMonths(startDate, count * step)
                break
            case 'years':
                currentDate = addYears(startDate, count * step)
                break

            default:
                break
        }
    }

    return dates
}
