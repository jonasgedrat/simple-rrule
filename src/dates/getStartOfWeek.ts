import { Day, Weekday } from '../types'
import { addDays } from './addDatesHelper'

export const getStartOfWeekWithoutChangeTime = (
    date: Date,
    wkst: Weekday
): Date => {
    let weekStartsOn: Day
    switch (wkst) {
        case 'SU':
            weekStartsOn = 0
            break
        case 'MO':
            weekStartsOn = 1
            break
        case 'TU':
            weekStartsOn = 2
            break
        case 'WE':
            weekStartsOn = 3
            break
        case 'TH':
            weekStartsOn = 4
            break
        case 'FR':
            weekStartsOn = 5
            break
        case 'SA':
            weekStartsOn = 6
            break
        default:
            weekStartsOn = 0
    }

    const dt = new Date(date)
    const day: Day = dt.getDay() as Day
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
    const startOfWeek = addDays(dt, diff * -1)
    return startOfWeek
}
