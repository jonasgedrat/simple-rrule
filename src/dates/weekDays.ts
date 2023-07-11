import { Day, Weekday } from '../types'

export const allDays = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday,
]

export interface IWeekDayInfo {
    weekDay: Weekday
    weekDayIndex: Day
}

export const getDayFromWeekDay = (weekDay: Weekday): Day => {
    const result = weekDayInfoList.find(
        (x) => x.weekDay === weekDay
    )?.weekDayIndex
    return result || 0
}

export const getWeekDayFromDate = (date: Date): Weekday => {
    const day = date.getDay()
    return allDays[day]
}

export const weekDayInfoList: IWeekDayInfo[] = [
    {
        weekDay: Weekday.Sunday,
        weekDayIndex: 0,
    },
    {
        weekDay: Weekday.Monday,
        weekDayIndex: 1,
    },
    {
        weekDay: Weekday.Tuesday,
        weekDayIndex: 2,
    },
    {
        weekDay: Weekday.Wednesday,
        weekDayIndex: 3,
    },
    {
        weekDay: Weekday.Thursday,
        weekDayIndex: 4,
    },
    {
        weekDay: Weekday.Friday,
        weekDayIndex: 5,
    },
    {
        weekDay: Weekday.Saturday,
        weekDayIndex: 6,
    },
]
