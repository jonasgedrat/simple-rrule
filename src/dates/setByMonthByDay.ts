import { MonthDays, YearMonths } from './../types'
import { getDaysInMonth } from './addDatesHelper'

// Nao muta `date` - retorna sempre uma nova instancia (ver rules/common/coding-style.md#imutabilidade).
// Preserva o dia atual, limitado (clamp) ao ultimo dia valido do mes de destino,
// em vez de deixar Date.setMonth "rolar" para o mes seguinte quando o dia atual
// nao existe no mes de destino (ex: dia=31 e o novo mes tem 30 dias). Mesma
// tecnica de clamp usada em addMonths.
export const setByMonth = (date: Date, month: YearMonths | number): Date => {
    if (month < 1 || month > 12) {
        throw new RangeError(
            `setByMonth invalid month, must be 1 to 12: ${month}`
        )
    }
    const newDate = new Date(date)
    const desiredDay = newDate.getDate()
    const dateWithDesiredMonth = new Date(0)
    dateWithDesiredMonth.setFullYear(newDate.getFullYear(), month - 1, 1)
    dateWithDesiredMonth.setHours(0, 0, 0, 0)
    const daysInMonth = getDaysInMonth(dateWithDesiredMonth)
    newDate.setMonth(month - 1, Math.min(daysInMonth, desiredDay))
    return newDate
}

// Nao muta `date` - retorna sempre uma nova instancia. O dia e limitado (clamp)
// ao ultimo dia valido do mes de `date`, em vez de sofrer "rollover" para o mes
// seguinte como o Date.setDate nativo faria (ex: dia=31 em abril vira 30, nao 1/mai).
export const setByDay = (date: Date, day: MonthDays | number): Date => {
    if (day < 1 || day > 31) {
        throw new RangeError(`setByDay invalid day, must be 1 to 31: ${day}`)
    }
    const newDate = new Date(date)
    const daysInMonth = getDaysInMonth(newDate)
    newDate.setDate(Math.min(day, daysInMonth))
    return newDate
}
