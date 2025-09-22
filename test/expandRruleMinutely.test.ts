import { describe, it, expect } from 'vitest'
import { expandRRule } from '../src/expandRrule'
import { Frequency } from '../src/types'
import { addMinutes } from '../src/dates'

describe('expandRruleMinutely', () => {
    it('should expand minutely recurrence correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-01-01T11:00:00.000Z')
        
        const rule = {
            frequency: Frequency.MINUTELY,
            interval: 15,
            dtStart: startDate,
            dtEnd: addMinutes(startDate, 5),
            count: 0,
            wkst: 'SU',
            byDay: '',
            byMonthDay: 0,
            byMonth: 0,
            bySetPos: 0,
            until: undefined
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
        
        const rule = {
            frequency: Frequency.MINUTELY,
            interval: 10,
            dtStart: startDate,
            dtEnd: addMinutes(startDate, 5),
            count: 0,
            wkst: 'SU',
            byDay: '',
            byMonthDay: 0,
            byMonth: 0,
            bySetPos: 0,
            until: untilDate
        }
        
        const result = expandRRule(rule, startDate, endDate)
        
        expect(result.events.length).toBe(3) // 10:00, 10:10, 10:20
        expect(result.events[2].date.getHours()).toBe(7)
        expect(result.events[2].date.getMinutes()).toBe(20)
    })
})