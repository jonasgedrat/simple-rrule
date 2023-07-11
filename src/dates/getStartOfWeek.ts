import { Day, Weekday } from '../types'
import { addDays } from './addDatesHelper'
import { getDayFromWeekDay } from './weekDays'

export const getStartOfWeekWithoutChangeTime = (
    date: Date,
    wkst: Weekday
): Date => {
    const weekStartsOn = getDayFromWeekDay(wkst)
    const dt = new Date(date)
    const day: Day = dt.getDay() as Day
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    const startOfWeek = addDays(dt, diff * -1)
    //startOfWeek.setHours(0, 0, 0, 0)
    return startOfWeek
}
