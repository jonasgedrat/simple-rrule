import { describe, it, expect } from 'vitest'
import { expandRRule } from '../src/expandRrule'
import { addMinutes } from '../src/dates'
import { IRrule, rRuleDefaultValues } from '../src/validators/rRule'

describe('expandRruleMinutely', () => {
    it('should expand minutely recurrence correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T11:00:00.000Z')

        const rule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: addMinutes(startDate, 5),
            frequency: 'MINUTELY',
            interval: 15,
        }

        const result = expandRRule(rule, startDate, endDate)

        expect(result.events.length).toBe(5) // 10:00, 10:15, 10:30, 10:45, 11:00
        expect(result.events[0].date.getMinutes()).toBe(0)
        expect(result.events[1].date.getMinutes()).toBe(15)
        expect(result.events[2].date.getMinutes()).toBe(30)
    })

    it('should respect until limit for minutely recurrence', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T11:00:00.000Z')
        const untilDate = new Date('2023-01-01T10:30:00.000Z')

        const rule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: addMinutes(startDate, 5),
            frequency: 'MINUTELY',
            interval: 10,
            until: untilDate,
        }

        const result = expandRRule(rule, startDate, endDate)

        expect(result.events.length).toBe(3) // 10:00, 10:10, 10:20
        expect(result.events[2].date.getUTCHours()).toBe(10)
        expect(result.events[2].date.getMinutes()).toBe(20)
    })
})

