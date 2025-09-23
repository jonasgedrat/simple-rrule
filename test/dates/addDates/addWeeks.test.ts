import { describe, it, expect } from 'vitest'
import { addWeeks } from '../../../src/dates'

describe('addWeeks', () => {
    it('adds the given number of weeks', () => {
        const result = addWeeks(new Date(2014, 8, 1), 4)
        expect(result).toEqual(new Date(2014, 8, 29))
    })

    it('converts a fractional number to an integer', () => {
        const result = addWeeks(new Date(2014, 8, 1), 0.5)
        expect(result).toEqual(new Date(2014, 8, 4, 12))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 8, 1)
        addWeeks(date, 2)
        expect(date).toEqual(new Date(2014, 8, 1))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result = addWeeks(new Date(NaN), 4)
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result = addWeeks(new Date(2014, 8, 1), NaN)
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Negative weeks tests
    it('subtracts weeks correctly', () => {
        const result = addWeeks(new Date(2014, 8, 29), -2) // September 29, 2014 - 2 weeks
        expect(result).toEqual(new Date(2014, 8, 15)) // September 15, 2014
    })

    it('subtracts weeks across month boundaries', () => {
        const result = addWeeks(new Date(2014, 9, 6), -2) // October 6, 2014 - 2 weeks
        expect(result).toEqual(new Date(2014, 8, 22)) // September 22, 2014
    })

    it('subtracts weeks across year boundaries', () => {
        const result = addWeeks(new Date(2015, 0, 12), -3) // January 12, 2015 - 3 weeks
        expect(result).toEqual(new Date(2014, 11, 22)) // December 22, 2014
    })

    // Zero weeks test
    it('returns the same date when adding zero weeks', () => {
        const date = new Date(2014, 8, 15, 14, 30, 45, 123)
        const result = addWeeks(date, 0)
        expect(result).toEqual(new Date(2014, 8, 15, 14, 30, 45, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addWeeks(new Date(2014, 0, 1), 52) // 1 year worth of weeks
        expect(result).toEqual(new Date(2014, 11, 31)) // Should be December 31, 2014 (52 weeks from Jan 1)
    })

    it('handles very large negative numbers', () => {
        const result = addWeeks(new Date(2015, 0, 7), -52) // 1 year worth of weeks
        expect(result).toEqual(new Date(2014, 0, 8)) // Should be January 8, 2014
    })

    // Month boundary tests
    it('adds weeks crossing month boundaries', () => {
        const result = addWeeks(new Date(2014, 6, 28), 1) // July 28, 2014 + 1 week
        expect(result).toEqual(new Date(2014, 7, 4)) // August 4, 2014
    })

    it('adds weeks crossing multiple months', () => {
        const result = addWeeks(new Date(2014, 6, 14), 6) // July 14, 2014 + 6 weeks
        expect(result).toEqual(new Date(2014, 7, 25)) // August 25, 2014
    })

    // Year boundary tests
    it('adds weeks crossing year boundaries', () => {
        const result = addWeeks(new Date(2014, 11, 22), 3) // December 22, 2014 + 3 weeks
        expect(result).toEqual(new Date(2015, 0, 12)) // January 12, 2015
    })

    it('adds weeks crossing multiple years', () => {
        const result = addWeeks(new Date(2014, 6, 1), 104) // July 1, 2014 + 104 weeks (2 years)
        expect(result).toEqual(new Date(2016, 5, 28)) // Should be June 28, 2016 (104 weeks = 728 days)
    })

    // Leap year tests
    it('adds weeks correctly across February 29 in leap year', () => {
        const result = addWeeks(new Date(2020, 1, 24), 1) // February 24, 2020 + 1 week
        expect(result).toEqual(new Date(2020, 2, 2)) // March 2, 2020
    })

    it('adds weeks correctly from February 29 in leap year', () => {
        const result = addWeeks(new Date(2020, 1, 29), 1) // February 29, 2020 + 1 week
        expect(result).toEqual(new Date(2020, 2, 7)) // March 7, 2020
    })

    it('subtracts weeks correctly to February 29 in leap year', () => {
        const result = addWeeks(new Date(2020, 2, 7), -1) // March 7, 2020 - 1 week
        expect(result).toEqual(new Date(2020, 1, 29)) // February 29, 2020
    })

    // Time preservation tests
    it('preserves time when adding weeks', () => {
        const result = addWeeks(new Date(2014, 8, 1, 14, 30, 45, 123), 2)
        expect(result).toEqual(new Date(2014, 8, 15, 14, 30, 45, 123))
    })

    it('preserves time when subtracting weeks', () => {
        const result = addWeeks(new Date(2014, 8, 15, 14, 30, 45, 123), -2)
        expect(result).toEqual(new Date(2014, 8, 1, 14, 30, 45, 123))
    })

    // Edge cases with different days of the week
    it('adds weeks maintaining day of the week', () => {
        const monday = new Date(2014, 8, 1) // Monday, September 1, 2014
        const result = addWeeks(monday, 1)
        expect(result).toEqual(new Date(2014, 8, 8)) // Monday, September 8, 2014
        expect(result.getDay()).toBe(monday.getDay()) // Should be the same day of the week
    })

    it('subtracts weeks maintaining day of the week', () => {
        const friday = new Date(2014, 8, 5) // Friday, September 5, 2014
        const result = addWeeks(friday, -1)
        expect(result).toEqual(new Date(2014, 7, 29)) // Friday, August 29, 2014
        expect(result.getDay()).toBe(friday.getDay()) // Should be the same day of the week
    })

    // Fractional weeks with different precision
    it('handles fractional weeks with quarter precision', () => {
        const result = addWeeks(new Date(2014, 8, 1, 0, 0, 0), 0.25) // 1.75 days = 42 hours
        expect(result).toEqual(new Date(2014, 8, 2, 18, 0, 0))
    })

    it('handles fractional weeks with three-quarter precision', () => {
        const result = addWeeks(new Date(2014, 8, 1, 0, 0, 0), 0.75) // 5.25 days = 126 hours
        expect(result).toEqual(new Date(2014, 8, 6, 6, 0, 0))
    })

    // Edge case: exactly 7 days
    it('adds exactly 1 week (7 days)', () => {
        const result = addWeeks(new Date(2014, 8, 1, 12, 0, 0), 1)
        expect(result).toEqual(new Date(2014, 8, 8, 12, 0, 0))
    })

    it('subtracts exactly 1 week (7 days)', () => {
        const result = addWeeks(new Date(2014, 8, 8, 12, 0, 0), -1)
        expect(result).toEqual(new Date(2014, 8, 1, 12, 0, 0))
    })
})
