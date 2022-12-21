import { isBefore } from 'date-fns'
import * as Yup from 'yup'
import { IRuleExtended } from './validators/rRule'

export const getBySetPos = (
    firstDayOfMonth: Date,
    r: IRuleExtended,
    count: number
): Date | undefined => {
    if (r.count > 0 && count === r.count) return undefined
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const byDayValid = Yup.mixed().oneOf(days)
    const isValidByDay = byDayValid.validateSync(r.byDay)

    const bySetPosValid = Yup.mixed().oneOf([-1, 1, 2, 3, 4])
    const isValidBySetPos = bySetPosValid.validateSync(r.bySetPos)

    if (!isValidByDay && !isValidBySetPos) {
        return undefined
    }

    const month = firstDayOfMonth.getMonth()
    const weekDaysInMonth = []
    const weekDayIndex = days.findIndex((x) => x === r.byDay)

    while (firstDayOfMonth.getDay() !== weekDayIndex) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
    }

    while (firstDayOfMonth.getMonth() === month) {
        weekDaysInMonth.push(new Date(firstDayOfMonth.getTime()))
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 7)
    }

    const result =
        r.bySetPos === -1
            ? weekDaysInMonth.slice(-1)[0]
            : weekDaysInMonth[r.bySetPos - 1]

    if (isBefore(result, r.dtStart)) return undefined
    if (isBefore(r.endRangePeriodOrUntil, result)) return undefined

    return result
}
