import { ByDay, ByDayValuesList, BySetPos } from './../types'

export const isWeekDayValid = (byDay: ByDay) => {
    return ByDayValuesList.includes(byDay)
}

export const isBySetPosValid = (bySetPos: BySetPos) => {
    const validValues = [-1, 1, 2, 3, 4]
    if (!validValues.includes(bySetPos)) {
        throw new Error(`Invalid bySetPos value: ${bySetPos}`)
    }
    return bySetPos
}
