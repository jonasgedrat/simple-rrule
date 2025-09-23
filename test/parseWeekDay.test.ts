import { describe, it, expect } from 'vitest'
import { parseWeekDay } from '../src/parseWeekDay'
import { Weekday } from '../src/types'

describe('parseWeekDay', () => {
    it('should parse weekday strings correctly', () => {
        expect(parseWeekDay('SU')).toBe(0)
        expect(parseWeekDay('MO')).toBe(1)
        expect(parseWeekDay('TU')).toBe(2)
        expect(parseWeekDay('WE')).toBe(3)
        expect(parseWeekDay('TH')).toBe(4)
        expect(parseWeekDay('FR')).toBe(5)
        expect(parseWeekDay('SA')).toBe(6)
    })

    it('should handle weekday enum values correctly', () => {
        expect(parseWeekDay('SU')).toBe(0)
        expect(parseWeekDay('MO')).toBe(1)
        expect(parseWeekDay('TU')).toBe(2)
        expect(parseWeekDay('WE')).toBe(3)
        expect(parseWeekDay('TH')).toBe(4)
        expect(parseWeekDay('FR')).toBe(5)
        expect(parseWeekDay('SA')).toBe(6)
    })

    it('should handle invalid inputs gracefully', () => {
        // @ts-ignore - Testing invalid input
        expect(parseWeekDay('')).toBe(0)
        // @ts-ignore - Testing invalid input
        expect(parseWeekDay('INVALID')).toBe(0)
        // @ts-ignore - Testing invalid input
        expect(parseWeekDay(null)).toBe(0)
        // @ts-ignore - Testing invalid input
        expect(parseWeekDay(undefined)).toBe(0)
    })
})
