import { describe, it, expect } from 'vitest'
import { expandRRule } from '../src/expandRrule'
import { BySetPos } from '../src/types'
import { IRrule, rRuleDefaultValues } from '../src/validators/rRule'

describe('expandRruleBySetPos', () => {
    it('should handle BYSETPOS with MONTHLY frequency correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2023-03-31T10:00:00.000Z')

        // Test for "First Monday of the month"
        const rule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: new Date('2023-01-01T11:00:00.000Z'),
            frequency: 'MONTHLY',
            byDay: 'MO',
            bySetPos: 1 as BySetPos,
        }

        const result = expandRRule(rule, startDate, endDate)

        // Should return first Monday of each month in the range
        expect(result.events.length).toBe(3) // Jan, Feb, Mar

        // First Monday of January 2023 is January 2
        expect(result.events[0].date.getMonth()).toBe(0) // January (0-indexed)
        expect(result.events[0].date.getDate()).toBe(2)

        // First Monday of February 2023 is February 6
        expect(result.events[1].date.getMonth()).toBe(1) // February
        expect(result.events[1].date.getDate()).toBe(6)

        // First Monday of March 2023 is March 6
        expect(result.events[2].date.getMonth()).toBe(2) // March
        expect(result.events[2].date.getDate()).toBe(6)
    })

    it('should handle BYSETPOS with YEARLY frequency correctly', () => {
        const startDate = new Date('2023-01-01T10:00:00.000Z')
        const endDate = new Date('2025-12-31T10:00:00.000Z')

        // Test for "Last Friday of March each year"
        const rule: IRrule = {
            ...rRuleDefaultValues,
            dtStart: startDate,
            dtEnd: new Date('2023-01-01T11:00:00.000Z'),
            frequency: 'YEARLY',
            byDay: 'FR',
            byMonth: 3, // March
            bySetPos: -1 as BySetPos, // Last occurrence
        }

        const result = expandRRule(rule, startDate, endDate)

        // Should return last Friday of March for each year in the range
        expect(result.events.length).toBe(3) // 2023, 2024, 2025

        // Last Friday of March 2023 is March 31
        expect(result.events[0].date.getFullYear()).toBe(2023)
        expect(result.events[0].date.getMonth()).toBe(2) // March (0-indexed)
        expect(result.events[0].date.getDate()).toBe(31)

        // Last Friday of March 2024 is March 29
        expect(result.events[1].date.getFullYear()).toBe(2024)
        expect(result.events[1].date.getMonth()).toBe(2) // March
        expect(result.events[1].date.getDate()).toBe(29)

        // Last Friday of March 2025 is March 28
        expect(result.events[2].date.getFullYear()).toBe(2025)
        expect(result.events[2].date.getMonth()).toBe(2) // March
        expect(result.events[2].date.getDate()).toBe(28)
    })
})

