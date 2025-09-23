import { describe, it, expect } from 'vitest'
import { expandRRule } from '../src/expandRrule'
import { addHours } from '../src/dates'
import { IRrule } from '../src/validators/rRule'

describe('expandRruleHourly', () => {
    it('should expand hourly recurrence correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T18:00:00.000Z')

        const rule: IRrule = {
            frequency: 'HOURLY',
            interval: 2,
            dtStart: startDate,
            dtEnd: addHours(startDate, 1),
            count: 0,
            wkst: 'SU',
            byDay: '',
            byMonthDay: 0,
            byMonth: 0,
            bySetPos: 0,
            until: undefined,
        }

        const result = expandRRule(rule, startDate, endDate)

        expect(result.events.length).toBe(5) // 10:00, 12:00, 14:00, 16:00, 18:00
        expect(result.events[0].date.getHours()).toBe(7)
        expect(result.events[1].date.getHours()).toBe(9)
        expect(result.events[2].date.getHours()).toBe(11)
    })

    it('should respect count limit for hourly recurrence', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T18:00:00.000Z')

        const rule: IRrule = {
            frequency: 'HOURLY',
            interval: 1,
            dtStart: startDate,
            dtEnd: addHours(startDate, 1),
            count: 3,
            wkst: 'SU',
            byDay: '',
            byMonthDay: 0,
            byMonth: 0,
            bySetPos: 0,
            until: undefined,
        }

        const result = expandRRule(rule, startDate, endDate)

        expect(result.events.length).toBe(3)
        expect(result.events[0].date.getHours()).toBe(7)
        expect(result.events[1].date.getHours()).toBe(8)
        expect(result.events[2].date.getHours()).toBe(9)
    })
})
