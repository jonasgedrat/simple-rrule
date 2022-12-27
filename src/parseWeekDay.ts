import { Weekday } from './types'

export const parseWeekDay = (weekDay: Weekday): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
    let result: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
    switch (weekDay) {
        case Weekday.Sunday:
            result = 0
            break
        case Weekday.Monday:
            result = 1
            break
        case Weekday.Tuesday:
            result = 2
            break
        case Weekday.Wednesday:
            result = 3
            break
        case Weekday.Thursday:
            result = 4
            break
        case Weekday.Friday:
            result = 5
            break
        case Weekday.Saturday:
            result = 6
            break
        default:
            result = 0
    }
    return result
}
