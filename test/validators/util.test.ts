import { describe, it, expect } from 'vitest'
import { isWeekDayValid, isBySetPosValid } from '../../src/validators/util'
import { Weekday, WeekdayValuesList, BySetPos } from '../../src/types'

describe('isWeekDayValid', () => {
    it('should validate valid week days', () => {
        const validDays: Weekday[] = ['SU', 'MO', 'TU']

        validDays.forEach((day) => {
            const result = isWeekDayValid(day)
            expect(result).toBe(true)
        })
    })
    it('should validate valid ALL week days', () => {
        const validDays: Weekday[] = WeekdayValuesList
        validDays.forEach((day) => {
            const result = isWeekDayValid(day)
            expect(result).toBe(true)
        })
    })

    it('should reject invalid week days', () => {
        const invalidDays = ['INVALID', 'XX', 'MONDAY', 'sunday', '', 'MOO']

        invalidDays.forEach((day) => {
            const result = isWeekDayValid(day as Weekday)
            expect(result).toBe(false)
        })
    })

    it('should handle edge cases', () => {
        const edgeCases = [null, undefined, 123, {}, []]

        edgeCases.forEach((day) => {
            const result = isWeekDayValid(day as Weekday)
            expect(result).toBe(false)
        })
    })
})

describe('isBySetPosValid', () => {
    it('should validate valid bySetPos values', () => {
        const validValues: BySetPos[] = [-1, 1, 2, 3, 4]

        validValues.forEach((value) => {
            const result = isBySetPosValid(value)
            expect(result).toBe(value)
        })
    })

    it('should throw error for invalid bySetPos values', () => {
        const invalidValues = [0, 5, -2, 10, 100, -10]

        invalidValues.forEach((value) => {
            expect(() => isBySetPosValid(value as BySetPos)).toThrow(
                `Invalid bySetPos value: ${value}`
            )
        })
    })

    it('should handle edge cases with proper error messages', () => {
        const edgeCases = [
            { value: 0, expectedError: 'Invalid bySetPos value: 0' },
            { value: 5, expectedError: 'Invalid bySetPos value: 5' },
            { value: -2, expectedError: 'Invalid bySetPos value: -2' },
            { value: 10, expectedError: 'Invalid bySetPos value: 10' },
        ]

        edgeCases.forEach(({ value, expectedError }) => {
            expect(() => isBySetPosValid(value as BySetPos)).toThrow(
                expectedError
            )
        })
    })

    it('should handle non-numeric values', () => {
        const nonNumericValues = ['1', '2', null, undefined, {}, [], 'invalid']

        nonNumericValues.forEach((value) => {
            expect(() => isBySetPosValid(value as BySetPos)).toThrow()
        })
    })
})
