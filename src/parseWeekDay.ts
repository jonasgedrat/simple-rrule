import { Weekday } from './types'

export const parseWeekDay = (weekDay: Weekday): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
    let result: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
    switch (weekDay) {
        case 'SU':
            result = 0
            break
        case 'MO':
            result = 1
            break
        case 'TU':
            result = 2
            break
        case 'WE':
            result = 3
            break
        case 'TH':
            result = 4
            break
        case 'FR':
            result = 5
            break
        case 'SA':
            result = 6
            break
        default:
            result = 0
    }
    return result
}
