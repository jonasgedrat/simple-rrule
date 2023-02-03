import {
    millisecondsInDay,
    millisecondsInHour,
    millisecondsInMinute,
} from './../constants'
import { compareAsc, isLastDayOfMonth } from './compare'

export const differenceInYears = (dateLeft: Date, dateRight: Date): number => {
    const _dateLeft = new Date(dateLeft)
    const _dateRight = new Date(dateRight)

    const sign = compareAsc(_dateLeft, _dateRight)
    const difference = Math.abs(
        _dateLeft.getFullYear() - _dateRight.getFullYear()
    )

    // Set both dates to a valid leap year for accurate comparison when dealing
    // with leap days
    _dateLeft.setFullYear(1584)
    _dateRight.setFullYear(1584)

    // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
    // If so, result must be decreased by 1 in absolute value
    const isLastYearNotFull = compareAsc(_dateLeft, _dateRight) === -sign
    const result = sign * (difference - Number(isLastYearNotFull))

    // Prevent negative zero

    return result === 0 ? 0 : result
}

export const differenceInMonths = (dateLeft: Date, dateRight: Date): number => {
    const sign = compareAsc(dateLeft, dateRight)
    const difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight))
    let result

    const _dateLeft = new Date(dateLeft)
    const _dateRight = new Date(dateRight)

    // Check for the difference of less than month
    if (difference < 1) {
        result = 0
    } else {
        if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
            // This will check if the date is end of Feb and assign a higher end of month date
            // to compare it with Jan
            _dateLeft.setDate(30)
        }

        _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference)

        // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
        // If so, result must be decreased by 1 in absolute value
        let isLastMonthNotFull = compareAsc(_dateLeft, _dateRight) === -sign

        // Check for cases of one full calendar month
        if (
            isLastDayOfMonth(_dateLeft) &&
            difference === 1 &&
            compareAsc(_dateLeft, _dateRight) === 1
        ) {
            isLastMonthNotFull = false
        }

        result = sign * (difference - Number(isLastMonthNotFull))
    }

    // Prevent negative zero
    return result === 0 ? 0 : result
}

export const differenceInWeeks = (dateLeft: Date, dateRight: Date): number => {
    return (
        differenceInMilliseconds(dateLeft, dateRight) / (millisecondsInDay * 7)
    )
}

export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
    return differenceInMilliseconds(dateLeft, dateRight) / millisecondsInDay
}

export const differenceInHours = (dateLeft: Date, dateRight: Date): number => {
    return differenceInMilliseconds(dateLeft, dateRight) / millisecondsInHour
}

export const differenceInMinutes = (
    dateLeft: Date,
    dateRight: Date
): number => {
    return differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute
}

export const differenceInSeconds = (
    dateLeft: Date,
    dateRight: Date
): number => {
    return differenceInMilliseconds(dateLeft, dateRight) / 1000
}

export const differenceInMilliseconds = (
    dateLeft: Date,
    dateRight: Date
): number => {
    return dateLeft.getTime() - dateRight.getTime()
}

/**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param dateLeft - the later date
 * @param dateRight - the earlier date
 * @returns the number of calendar months
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */
export const differenceInCalendarMonths = (
    dateLeft: Date,
    dateRight: Date
): number => {
    const yearDiff = dateLeft.getFullYear() - dateRight.getFullYear()
    const monthDiff = dateLeft.getMonth() - dateRight.getMonth()

    return yearDiff * 12 + monthDiff
}
