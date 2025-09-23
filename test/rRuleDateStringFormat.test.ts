import { describe, it, expect } from 'vitest'
import { fromRruleDateStringToDate, toRRuleDateString } from '../src/dates'

const dateString = '2022-12-15T15:20:30.000Z'
const errorString = 'Invalid fromRruleDateStringToDate'

describe('rRuleDateStringFormat', () => {
    it('should format and parse date strings correctly', () => {
        const originDate = new Date(dateString)

        const formattedDate = toRRuleDateString(originDate)

        expect(formattedDate).toEqual('20221215T152030Z')

        const dateResult = fromRruleDateStringToDate(formattedDate)

        expect(dateResult).toBeInstanceOf(Date)

        expect(dateResult.toISOString()).toEqual(dateString)
        expect(dateResult).toEqual(originDate)
    })

    it('should handle non regular format with milliseconds', () => {
        const dateResult = fromRruleDateStringToDate('20221215T152030123Z')

        expect(dateResult).toBeInstanceOf(Date)

        expect(dateResult.toISOString()).toEqual(dateString)
    })

    describe('toRRuleDateString', () => {
        it('should handle UTC mode correctly', () => {
            const date = new Date('2022-12-15T15:20:30.000Z')
            const result = toRRuleDateString(date, true)
            expect(result).toBe('20221215T152030Z')
        })

        it('should handle local time mode correctly', () => {
            const date = new Date('2022-12-15T15:20:30.000Z')
            const result = toRRuleDateString(date, false)
            // Result will vary based on timezone, but should not have 'Z' suffix
            expect(result).not.toContain('Z')
            expect(result).toMatch(/^\d{8}T\d{6}$/)
        })

        it('should pad single digits correctly', () => {
            const date = new Date('2001-01-01T01:01:01.000Z')
            const result = toRRuleDateString(date)
            expect(result).toBe('20010101T010101Z')
        })
    })

    describe('fromRruleDateStringToDate', () => {
        it('should throw error for invalid format', () => {
            expect(() => fromRruleDateStringToDate('invalid')).toThrow(
                errorString
            )
            expect(() => fromRruleDateStringToDate('20221215')).toThrow(
                errorString
            )
            expect(() => fromRruleDateStringToDate('20221215T152030')).toThrow(
                errorString
            )
        })

        it('should throw error for invalid date values', () => {
            expect(() => fromRruleDateStringToDate('20221315T152030Z')).toThrow(
                errorString
            )
            expect(() => fromRruleDateStringToDate('20221215T252030Z')).toThrow(
                errorString
            )
            expect(() => fromRruleDateStringToDate('20221215T156030Z')).toThrow(
                errorString
            )
            expect(() => fromRruleDateStringToDate('20221215T152060Z')).toThrow(
                errorString
            )
        })

        it('should handle leap year correctly', () => {
            const result = fromRruleDateStringToDate('20200229T120000Z')
            expect(result.toISOString()).toBe('2020-02-29T12:00:00.000Z')
        })

        it('should handle edge cases for days in month', () => {
            expect(() =>
                fromRruleDateStringToDate('20220131T120000Z')
            ).not.toThrow()
            expect(() =>
                fromRruleDateStringToDate('20220430T120000Z')
            ).not.toThrow()
        })

        it('should ignore milliseconds in input', () => {
            const result1 = fromRruleDateStringToDate('20221215T152030Z')
            const result2 = fromRruleDateStringToDate('20221215T152030123Z')
            const result3 = fromRruleDateStringToDate('20221215T15203099999Z')

            expect(result1.toISOString()).toBe('2022-12-15T15:20:30.000Z')
            expect(result2.toISOString()).toBe('2022-12-15T15:20:30.000Z')
            expect(result3.toISOString()).toBe('2022-12-15T15:20:30.000Z')
        })

        it('should handle boundary years', () => {
            const result1 = fromRruleDateStringToDate('10000101T120000Z')
            const result2 = fromRruleDateStringToDate('29991231T120000Z')

            expect(result1.getUTCFullYear()).toBe(1000)
            expect(result2.getUTCFullYear()).toBe(2999)
        })
    })

    describe('round-trip conversion', () => {
        it('should maintain consistency in round-trip conversion', () => {
            const originalDates = [
                new Date('2022-12-15T15:20:30.000Z'),
                new Date('2000-01-01T00:00:00.000Z'),
                new Date('2023-12-31T23:59:59.000Z'),
                new Date('2020-02-29T12:30:45.000Z'), // Leap year
            ]

            originalDates.forEach((originalDate) => {
                const formatted = toRRuleDateString(originalDate)
                const parsed = fromRruleDateStringToDate(formatted)
                expect(parsed.toISOString()).toBe(originalDate.toISOString())
            })
        })
    })
})
