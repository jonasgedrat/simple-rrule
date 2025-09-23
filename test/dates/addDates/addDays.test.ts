import { describe, it, expect } from 'vitest'
import { addDays } from '../../../src/dates'

describe('addDays', () => {
    it('adds the given number of days', () => {
        const result = addDays(new Date(2014, 8, 1), 10)
        expect(result).toEqual(new Date(2014, 8, 11))
    })

    it('converts a fractional number to an integer', () => {
        const result = addDays(new Date(2014, 8, 1), 0.5)
        expect(result).toEqual(new Date(2014, 8, 1, 12))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 8, 1)
        addDays(date, 11)
        expect(date).toEqual(new Date(2014, 8, 1))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result = addDays(new Date(NaN), 10)
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result = addDays(new Date(2014, 8, 1), NaN)
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Leap year tests
    it('adds days correctly in February of a leap year', () => {
        const result = addDays(new Date(2020, 1, 28), 1) // February 28, 2020 (leap year)
        expect(result).toEqual(new Date(2020, 1, 29))
    })

    it('adds days correctly from the last day of February in a leap year', () => {
        const result = addDays(new Date(2020, 1, 29), 1) // February 29, 2020 (leap year)
        expect(result).toEqual(new Date(2020, 2, 1)) // March 1, 2020
    })

    it('adds days correctly from the last day of February in a non-leap year', () => {
        const result = addDays(new Date(2019, 1, 28), 1) // February 28, 2019 (non-leap year)
        expect(result).toEqual(new Date(2019, 2, 1)) // March 1, 2019
    })

    it('adds days correctly across multiple months in a leap year', () => {
        const result = addDays(new Date(2020, 1, 15), 45) // February 15, 2020 + 45 days
        expect(result).toEqual(new Date(2020, 2, 31)) // March 31, 2020
    })

    it('adds days correctly from December to January crossing a leap year', () => {
        const result = addDays(new Date(2019, 11, 30), 60) // December 30, 2019 + 60 days
        expect(result).toEqual(new Date(2020, 1, 28)) // February 28, 2020
    })

    it('adds days correctly from January to March in a leap year', () => {
        const result = addDays(new Date(2020, 0, 31), 32) // January 31, 2020 + 32 days
        expect(result).toEqual(new Date(2020, 2, 3)) // March 3, 2020
    })

    // Negative days tests (subtracting days)
    it('subtracts days correctly', () => {
        const result = addDays(new Date(2014, 8, 11), -10)
        expect(result).toEqual(new Date(2014, 8, 1))
    })

    it('subtracts days correctly across month boundaries', () => {
        const result = addDays(new Date(2020, 2, 5), -10) // March 5, 2020 - 10 days
        expect(result).toEqual(new Date(2020, 1, 24)) // February 24, 2020
    })

    it('subtracts days correctly from leap year February', () => {
        const result = addDays(new Date(2020, 2, 1), -1) // March 1, 2020 - 1 day
        expect(result).toEqual(new Date(2020, 1, 29)) // February 29, 2020 (leap year)
    })

    it('subtracts days correctly from non-leap year March', () => {
        const result = addDays(new Date(2019, 2, 1), -1) // March 1, 2019 - 1 day
        expect(result).toEqual(new Date(2019, 1, 28)) // February 28, 2019 (non-leap year)
    })

    it('subtracts days correctly across year boundaries', () => {
        const result = addDays(new Date(2020, 0, 5), -10) // January 5, 2020 - 10 days
        expect(result).toEqual(new Date(2019, 11, 26)) // December 26, 2019
    })

    // Zero days test
    it('returns the same date when adding zero days', () => {
        const date = new Date(2014, 8, 1)
        const result = addDays(date, 0)
        expect(result).toEqual(new Date(2014, 8, 1))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addDays(new Date(2020, 0, 1), 365) // January 1, 2020 + 365 days
        expect(result).toEqual(new Date(2020, 11, 31)) // December 31, 2020 (leap year)
    })

    it('handles very large negative numbers', () => {
        const result = addDays(new Date(2020, 11, 31), -366) // December 31, 2020 - 366 days
        expect(result).toEqual(new Date(2019, 11, 31)) // December 31, 2019
    })

    // Month boundary tests
    it('handles end of January to February in leap year', () => {
        const result = addDays(new Date(2020, 0, 31), 1) // January 31, 2020 + 1 day
        expect(result).toEqual(new Date(2020, 1, 1)) // February 1, 2020
    })

    it('handles end of January to February in non-leap year', () => {
        const result = addDays(new Date(2019, 0, 31), 1) // January 31, 2019 + 1 day
        expect(result).toEqual(new Date(2019, 1, 1)) // February 1, 2019
    })

    it('handles end of April (30 days) to May', () => {
        const result = addDays(new Date(2020, 3, 30), 1) // April 30, 2020 + 1 day
        expect(result).toEqual(new Date(2020, 4, 1)) // May 1, 2020
    })

    it('handles end of December to January (year transition)', () => {
        const result = addDays(new Date(2019, 11, 31), 1) // December 31, 2019 + 1 day
        expect(result).toEqual(new Date(2020, 0, 1)) // January 1, 2020
    })

    // Time preservation tests
    it('preserves time when adding days', () => {
        const result = addDays(new Date(2020, 5, 15, 14, 30, 45, 123), 5)
        expect(result).toEqual(new Date(2020, 5, 20, 14, 30, 45, 123))
    })

    it('preserves time when subtracting days', () => {
        const result = addDays(new Date(2020, 5, 20, 9, 15, 30, 500), -3)
        expect(result).toEqual(new Date(2020, 5, 17, 9, 15, 30, 500))
    })
})
