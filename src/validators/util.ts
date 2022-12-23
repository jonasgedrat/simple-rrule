import * as Yup from 'yup'
import { ByDay, BySetPos } from './../types'
export const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const isWeekDayValid = (byDay: ByDay) => {
    const byDayValid = Yup.mixed().oneOf(days)
    return byDayValid.validateSync(byDay)
}

export const isBySetPosValid = (bySetPos: BySetPos) => {
    const bySetPosValid = Yup.mixed().oneOf([-1, 1, 2, 3, 4])
    return bySetPosValid.validateSync(bySetPos)
}
