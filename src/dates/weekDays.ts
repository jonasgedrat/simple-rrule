import { Day, Weekday, WeekdayValuesList } from '../types'

export const allDays = WeekdayValuesList

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
        weekDay: 'SU',
        weekDayIndex: 0,
    },
    {
        weekDay: 'MO',
        weekDayIndex: 1,
    },
    {
        weekDay: 'TU',
        weekDayIndex: 2,
    },
    {
        weekDay: 'WE',
        weekDayIndex: 3,
    },
    {
        weekDay: 'TH',
        weekDayIndex: 4,
    },
    {
        weekDay: 'FR',
        weekDayIndex: 5,
    },
    {
        weekDay: 'SA',
        weekDayIndex: 6,
    },
]
