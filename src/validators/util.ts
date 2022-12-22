import * as Yup from 'yup'
export const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const isWeekDayValid = (
    byDay: 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | string
) => {
    const byDayValid = Yup.mixed().oneOf(days)
    return byDayValid.validateSync(byDay)
}

export const isBySetPosValid = (bySetPos: number) => {
    const bySetPosValid = Yup.mixed().oneOf([-1, 1, 2, 3, 4])
    return bySetPosValid.validateSync(bySetPos)
}
