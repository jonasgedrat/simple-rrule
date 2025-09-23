import {
    millisecondsInSecond,
    minutesInHour,
    secondsInMinute,
} from '../constants'

export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const monthIndex = date.getMonth()
    const lastDayOfMonth = new Date(0)
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0)
    lastDayOfMonth.setHours(0, 0, 0, 0)
    return lastDayOfMonth.getDate()
}

export const addMonths = (date: Date, months: number) => {
    const newDate = new Date(date)
    const desiredMonth = newDate.getMonth() + months
    const dateWithDesiredMonth = new Date(0)
    dateWithDesiredMonth.setFullYear(newDate.getFullYear(), desiredMonth, 1)
    dateWithDesiredMonth.setHours(0, 0, 0, 0)
    const daysInMonth = getDaysInMonth(dateWithDesiredMonth)
    newDate.setMonth(desiredMonth, Math.min(daysInMonth, newDate.getDate()))
    return newDate
}

export const addYears = (date: Date, years: number) => {
    return addMonths(date, years * 12)
}
export const addWeeks = (date: Date, weeks: number): Date => {
    return addHours(date, 24 * weeks * 7)
}

export const addDays = (date: Date, days: number): Date => {
    return addHours(date, 24 * days)
}

export const addHours = (date: Date, hours: number): Date => {
    return addMinutes(date, minutesInHour * hours)
}

export const addMinutes = (date: Date, minutes: number): Date => {
    return addSeconds(date, secondsInMinute * minutes)
}

export const addSeconds = (date: Date, seconds: number): Date => {
    return addMilliseconds(date, millisecondsInSecond * seconds)
}

export const addMilliseconds = (
    date: Date,
    millisecondsAmount: number
): Date => {
    return new Date(date.getTime() + millisecondsAmount)
}
