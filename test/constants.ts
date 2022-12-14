import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { Frequency } from '../src/types'

export const d = {
    year: 2021,
    month: 11,
    day: 1,
    hour: 10,
    minute: 30,
    second: 45,
}

export const count = 12
export const intervals = [1, 3]

export const today = new Date(
    d.year,
    d.month,
    d.day,
    d.hour,
    d.minute,
    d.second
)

export const frequencies = [
    Frequency.MINUTELY,
    Frequency.HOURLY,
    Frequency.DAILY,
    Frequency.WEEKLY,
]

console.log('today', today)

export const dtStart = `DTSTART:${toRRuleDateString(today)}`
