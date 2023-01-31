import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addYears,
} from './addDatesHelper'

export const eachDateOfInterval = (
    startDate: Date,
    endDate: Date,
    maxCount: number = 0,
    dateUnitType:
        | 'milliseconds'
        | 'seconds'
        | 'minutes'
        | 'hours'
        | 'days'
        | 'weeks'
        | 'months'
        | 'years',
    step: number = 1
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
                currentDate = addSeconds(currentDate, count * step)
                break
            case 'minutes':
                currentDate = addMinutes(currentDate, count * step)
                break
            case 'hours':
                currentDate = addHours(currentDate, count * step)
                break
            case 'days':
                currentDate = addDays(currentDate, count * step)
                break
            case 'weeks':
                currentDate = addDays(currentDate, count * 7 * step)
                break
            case 'months':
                currentDate = addMonths(currentDate, count * step)
                break
            case 'years':
                currentDate = addYears(currentDate, count * step)
                break

            default:
                break
        }
    }

    return dates
}
