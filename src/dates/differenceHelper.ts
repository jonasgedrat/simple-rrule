import dayjs from 'dayjs'

export const difference = (
    dateLeft: Date,
    dateRight: Date,
    dateUnitType:
        | 'seconds'
        | 'minutes'
        | 'hours'
        | 'days'
        | 'weeks'
        | 'months'
        | 'years'
): number => {
    const _dateLeft = dayjs(dateLeft)
    const _dateRight = dayjs(dateRight)
    return _dateLeft.diff(_dateRight, dateUnitType)
}

export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
    return difference(dateLeft, dateRight, 'days')
}

export const differenceInHours = (dateLeft: Date, dateRight: Date): number => {
    return difference(dateLeft, dateRight, 'hours')
}

export const differenceInMinutes = (
    dateLeft: Date,
    dateRight: Date
): number => {
    return difference(dateLeft, dateRight, 'minutes')
}

export const differenceInMonths = (dateLeft: Date, dateRight: Date): number => {
    return difference(dateLeft, dateRight, 'months')
}

export const differenceInSeconds = (
    dateLeft: Date,
    dateRight: Date
): number => {
    return difference(dateLeft, dateRight, 'seconds')
}

export const differenceInWeeks = (dateLeft: Date, dateRight: Date): number => {
    return difference(dateLeft, dateRight, 'weeks')
}

export const differenceInYears = (dateLeft: Date, dateRight: Date): number => {
    return difference(dateLeft, dateRight, 'years')
}
