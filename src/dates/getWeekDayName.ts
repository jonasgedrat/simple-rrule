import { WeekdayValuesList } from '../types'

// Lookup direto (independe de dados de Intl/locale e e mais rapido em
// chamadas dentro de laco, ex: expansao de regras WEEKLY).
export const getWeekDayName = (date: Date) => {
    return WeekdayValuesList[date.getDay()]
}
