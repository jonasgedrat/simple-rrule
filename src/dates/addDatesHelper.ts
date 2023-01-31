import dayjs from 'dayjs'

export const addYears = (date: Date, years: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(years, 'year').toDate()
}

export const addMonths = (date: Date, months: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(months, 'month').toDate()
}

export const addWeeks = (date: Date, weeks: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(weeks, 'week').toDate()
}

export const addDays = (date: Date, days: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(days, 'day').toDate()
}

export const addHours = (date: Date, hours: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(hours, 'hour').toDate()
}

export const addMinutes = (date: Date, minutes: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(minutes, 'minute').toDate()
}

export const addSeconds = (date: Date, seconds: number): Date => {
    const _dayjs = dayjs(date)
    return _dayjs.add(seconds, 'second').toDate()
}
