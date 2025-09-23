import { describe, it, expect } from 'vitest'
import { addMonths } from '../../../src/dates'

describe('addMonths', () => {
    it('adds the given number of months', () => {
        const result = addMonths(new Date(2014, 8, 1), 5)
        expect(result).toEqual(new Date(2015, 1, 1))
    })

    it('converts a fractional number to an integer', () => {
        const result = addMonths(new Date(2014, 8, 1), 5.75)
        expect(result).toEqual(new Date(2015, 1, 1))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 8, 1)
        addMonths(date, 12)
        expect(date).toEqual(new Date(2014, 8, 1))
    })

    it('works well if the desired month has fewer days and the provided date is in the last day of a month', () => {
        const date = new Date(2014, 11, 31)
        const result = addMonths(date, 2)
        expect(result).toEqual(new Date(2015, 1, 28))
    })

    it('handles dates before 100 AD', () => {
        const initialDate = new Date(0)
        initialDate.setFullYear(0, 0, 31)
        initialDate.setHours(0, 0, 0, 0)
        const expectedResult = new Date(0)
        expectedResult.setFullYear(0, 1, 29)
        expectedResult.setHours(0, 0, 0, 0)
        const result = addMonths(initialDate, 1)
        expect(result).toEqual(expectedResult)
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result: any = addMonths(new Date(NaN), 5)
        expect(isNaN(result)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result: any = addMonths(new Date(2014, 8, 1), NaN)
        expect(isNaN(result)).toBeTruthy()
    })

    // Negative months tests
    it('subtracts months correctly', () => {
        const result = addMonths(new Date(2014, 8, 15), -3) // September 15, 2014 - 3 months
        expect(result).toEqual(new Date(2014, 5, 15)) // June 15, 2014
    })

    it('subtracts months across year boundaries', () => {
        const result = addMonths(new Date(2015, 2, 15), -6) // March 15, 2015 - 6 months
        expect(result).toEqual(new Date(2014, 8, 15)) // September 15, 2014
    })

    it('subtracts months with day adjustment when target month has fewer days', () => {
        const result = addMonths(new Date(2014, 4, 31), -2) // May 31, 2014 - 2 months
        expect(result).toEqual(new Date(2014, 2, 31)) // March 31, 2014
    })

    it('subtracts months with day adjustment to February in non-leap year', () => {
        const result = addMonths(new Date(2014, 4, 31), -3) // May 31, 2014 - 3 months
        expect(result).toEqual(new Date(2014, 1, 28)) // February 28, 2014
    })

    // Zero months test
    it('returns the same date when adding zero months', () => {
        const date = new Date(2014, 6, 15, 12, 30, 45, 123)
        const result = addMonths(date, 0)
        expect(result).toEqual(new Date(2014, 6, 15, 12, 30, 45, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addMonths(new Date(2014, 0, 15), 120) // 10 years worth of months
        expect(result).toEqual(new Date(2024, 0, 15))
    })

    it('handles very large negative numbers', () => {
        const result = addMonths(new Date(2024, 0, 15), -120) // 10 years worth of months
        expect(result).toEqual(new Date(2014, 0, 15))
    })

    // Leap year specific tests
    it('adds months to February 29 in leap year', () => {
        const result = addMonths(new Date(2020, 1, 29), 1) // February 29, 2020 + 1 month
        expect(result).toEqual(new Date(2020, 2, 29)) // March 29, 2020
    })

    it('adds months from February 29 to non-leap year February', () => {
        const result = addMonths(new Date(2020, 1, 29), 12) // February 29, 2020 + 12 months
        expect(result).toEqual(new Date(2021, 1, 28)) // February 28, 2021 (adjusted)
    })

    it('subtracts months from February 29 in leap year', () => {
        const result = addMonths(new Date(2020, 1, 29), -12) // February 29, 2020 - 12 months
        expect(result).toEqual(new Date(2019, 1, 28)) // February 28, 2019 (adjusted)
    })

    it('adds months crossing leap year boundary', () => {
        const result = addMonths(new Date(2019, 1, 28), 12) // February 28, 2019 + 12 months
        expect(result).toEqual(new Date(2020, 1, 28)) // February 28, 2020
    })

    // Month boundary edge cases
    it('handles January to December transition', () => {
        const result = addMonths(new Date(2014, 0, 31), -1) // January 31, 2014 - 1 month
        expect(result).toEqual(new Date(2013, 11, 31)) // December 31, 2013
    })

    it('handles December to January transition', () => {
        const result = addMonths(new Date(2013, 11, 31), 1) // December 31, 2013 + 1 month
        expect(result).toEqual(new Date(2014, 0, 31)) // January 31, 2014
    })

    // Day adjustment edge cases
    it('adjusts day when adding months to January 31 to February', () => {
        const result = addMonths(new Date(2014, 0, 31), 1) // January 31, 2014 + 1 month
        expect(result).toEqual(new Date(2014, 1, 28)) // February 28, 2014
    })

    it('adjusts day when adding months to March 31 to April', () => {
        const result = addMonths(new Date(2014, 2, 31), 1) // March 31, 2014 + 1 month
        expect(result).toEqual(new Date(2014, 3, 30)) // April 30, 2014
    })

    it('adjusts day when adding months to May 31 to June', () => {
        const result = addMonths(new Date(2014, 4, 31), 1) // May 31, 2014 + 1 month
        expect(result).toEqual(new Date(2014, 5, 30)) // June 30, 2014
    })

    it('adjusts day when adding months to August 31 to September', () => {
        const result = addMonths(new Date(2014, 7, 31), 1) // August 31, 2014 + 1 month
        expect(result).toEqual(new Date(2014, 8, 30)) // September 30, 2014
    })

    it('adjusts day when adding months to October 31 to November', () => {
        const result = addMonths(new Date(2014, 9, 31), 1) // October 31, 2014 + 1 month
        expect(result).toEqual(new Date(2014, 10, 30)) // November 30, 2014
    })

    // Time preservation tests
    it('preserves time when adding months', () => {
        const result = addMonths(new Date(2014, 6, 15, 14, 30, 45, 123), 3)
        expect(result).toEqual(new Date(2014, 9, 15, 14, 30, 45, 123))
    })

    it('preserves time when subtracting months', () => {
        const result = addMonths(new Date(2014, 9, 15, 14, 30, 45, 123), -3)
        expect(result).toEqual(new Date(2014, 6, 15, 14, 30, 45, 123))
    })

    // Multiple year transitions
    it('adds multiple years worth of months', () => {
        const result = addMonths(new Date(2014, 6, 15), 30) // 2.5 years
        expect(result).toEqual(new Date(2016, 12, 15)) // January 15, 2017
    })

    it('subtracts multiple years worth of months', () => {
        const result = addMonths(new Date(2017, 0, 15), -30) // 2.5 years
        expect(result).toEqual(new Date(2014, 6, 15)) // July 15, 2014
    })
})
