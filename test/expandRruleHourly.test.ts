import { describe, it, expect } from 'vitest'
import { expandRRule } from '../src/expandRrule'
import { addDays, addHours } from '../src/dates'
import { IRrule, rRuleDefaultValues } from '../src/validators/rRule'
import { getRRuleString } from '../src/getRrule'

describe('expandRruleHourly', () => {
    it('should expand hourly recurrence correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T18:00:00.000Z')

        const rRule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: addHours(startDate, 1),
            frequency: 'HOURLY',
            interval: 2,
        }

        const result = expandRRule(
            rRule,
            addDays(startDate, 1),
            addDays(endDate, 1)
        )

        expect(result.events.length).toBe(5) // 10:00, 12:00, 14:00, 16:00, 18:00
        expect(result.events[0].date.getUTCHours()).toBe(10)
        expect(result.events[1].date.getUTCHours()).toBe(12)
        expect(result.events[2].date.getUTCHours()).toBe(14)
    })

    it('should respect count limit for hourly recurrence', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T18:00:00.000Z')

        const rule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: addHours(startDate, 1),
            frequency: 'HOURLY',
            count: 3,
        }

        const result = expandRRule(rule, startDate, endDate)

        expect(result.events.length).toBe(3)
        expect(result.events[0].date.getUTCHours()).toBe(10)
        expect(result.events[1].date.getUTCHours()).toBe(11)
        expect(result.events[2].date.getUTCHours()).toBe(12)
    })
})
