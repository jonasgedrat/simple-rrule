import * as z from 'zod'
import { ByDay, BySetPos } from './../types'
export const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const isWeekDayValid = (byDay: ByDay) => {
    const byDayValid = z.enum(days as [string, ...string[]])
    return byDayValid.parse(byDay)
}

export const isBySetPosValid = (bySetPos: BySetPos) => {
    const validValues = [-1, 0, 1, 2, 3, 4]
    if (!validValues.includes(bySetPos)) {
        throw new Error(`Invalid bySetPos value: ${bySetPos}`)
    }
    return bySetPos
}
