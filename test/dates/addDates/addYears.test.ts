import { describe, it, expect } from 'vitest'
import { addYears } from '../../../src/dates'

describe('addYears', () => {
    it('adds the given number of years', () => {
        const result = addYears(new Date(2014, 8, 1), 5)
        expect(result).toEqual(new Date(2019, 8, 1))
    })

    it('converts a fractional number to an integer', () => {
        const result = addYears(new Date(2014, 8, 1), 5.75) // 5.75 * 12 = 69 months
        expect(result).toEqual(new Date(2020, 5, 1)) // September 2014 + 69 months = June 2020
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 8, 1)
        addYears(date, 10)
        expect(date).toEqual(new Date(2014, 8, 1))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result: any = addYears(new Date(NaN), 5)
        expect(isNaN(result)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result: any = addYears(new Date(2014, 8, 1), NaN)
        expect(isNaN(result)).toBeTruthy()
    })

    // Negative years tests
    it('subtracts years correctly', () => {
        const result = addYears(new Date(2019, 6, 15), -5)
        expect(result).toEqual(new Date(2014, 6, 15))
    })

    it('subtracts years across century boundaries', () => {
        const result = addYears(new Date(2005, 3, 20), -10)
        expect(result).toEqual(new Date(1995, 3, 20))
    })

    // Zero years test
    it('returns the same date when adding zero years', () => {
        const date = new Date(2014, 6, 15, 12, 30, 45, 123)
        const result = addYears(date, 0)
        expect(result).toEqual(new Date(2014, 6, 15, 12, 30, 45, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addYears(new Date(2014, 0, 15), 100)
        expect(result).toEqual(new Date(2114, 0, 15))
    })

    it('handles very large negative numbers', () => {
        const result = addYears(new Date(2114, 0, 15), -100)
        expect(result).toEqual(new Date(2014, 0, 15))
    })

    // Leap year specific tests
    it('adds years to February 29 in leap year to non-leap year', () => {
        const result = addYears(new Date(2020, 1, 29), 1) // February 29, 2020 + 1 year
        expect(result).toEqual(new Date(2021, 1, 28)) // February 28, 2021 (adjusted)
    })

    it('adds years to February 29 in leap year to another leap year', () => {
        const result = addYears(new Date(2020, 1, 29), 4) // February 29, 2020 + 4 years
        expect(result).toEqual(new Date(2024, 1, 29)) // February 29, 2024
    })

    it('subtracts years from February 29 in leap year to non-leap year', () => {
        const result = addYears(new Date(2020, 1, 29), -1) // February 29, 2020 - 1 year
        expect(result).toEqual(new Date(2019, 1, 28)) // February 28, 2019 (adjusted)
    })

    it('subtracts years from February 29 in leap year to another leap year', () => {
        const result = addYears(new Date(2020, 1, 29), -4) // February 29, 2020 - 4 years
        expect(result).toEqual(new Date(2016, 1, 29)) // February 29, 2016
    })

    it('adds years from non-leap year February 28 to leap year', () => {
        const result = addYears(new Date(2019, 1, 28), 1) // February 28, 2019 + 1 year
        expect(result).toEqual(new Date(2020, 1, 28)) // February 28, 2020 (no adjustment needed)
    })

    it('handles leap year transitions with other months', () => {
        const result = addYears(new Date(2020, 2, 15), 1) // March 15, 2020 + 1 year
        expect(result).toEqual(new Date(2021, 2, 15)) // March 15, 2021
    })

    // Century boundary tests
    it('adds years crossing from 20th to 21st century', () => {
        const result = addYears(new Date(1995, 6, 15), 10)
        expect(result).toEqual(new Date(2005, 6, 15))
    })

    it('subtracts years crossing from 21st to 20th century', () => {
        const result = addYears(new Date(2005, 6, 15), -10)
        expect(result).toEqual(new Date(1995, 6, 15))
    })

    it('handles century leap year (2000)', () => {
        const result = addYears(new Date(2000, 1, 29), 1) // February 29, 2000 + 1 year
        expect(result).toEqual(new Date(2001, 1, 28)) // February 28, 2001 (adjusted)
    })

    it('handles non-century leap year transition (1900)', () => {
        const result = addYears(new Date(1899, 1, 28), 1) // February 28, 1899 + 1 year
        expect(result).toEqual(new Date(1900, 1, 28)) // February 28, 1900 (1900 is not a leap year)
    })

    // Time preservation tests
    it('preserves time when adding years', () => {
        const result = addYears(new Date(2014, 6, 15, 14, 30, 45, 123), 5)
        expect(result).toEqual(new Date(2019, 6, 15, 14, 30, 45, 123))
    })

    it('preserves time when subtracting years', () => {
        const result = addYears(new Date(2019, 6, 15, 14, 30, 45, 123), -5)
        expect(result).toEqual(new Date(2014, 6, 15, 14, 30, 45, 123))
    })

    it('preserves time when adjusting February 29 to February 28', () => {
        const result = addYears(new Date(2020, 1, 29, 14, 30, 45, 123), 1) // February 29, 2020 + 1 year
        expect(result).toEqual(new Date(2021, 1, 28, 14, 30, 45, 123)) // February 28, 2021 with preserved time
    })

    // Edge cases with different months
    it('handles adding years to January 31', () => {
        const result = addYears(new Date(2014, 0, 31), 1) // January 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 0, 31)) // January 31, 2015
    })

    it('handles adding years to March 31', () => {
        const result = addYears(new Date(2014, 2, 31), 1) // March 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 2, 31)) // March 31, 2015
    })

    it('handles adding years to May 31', () => {
        const result = addYears(new Date(2014, 4, 31), 1) // May 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 4, 31)) // May 31, 2015
    })

    it('handles adding years to July 31', () => {
        const result = addYears(new Date(2014, 6, 31), 1) // July 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 6, 31)) // July 31, 2015
    })

    it('handles adding years to August 31', () => {
        const result = addYears(new Date(2014, 7, 31), 1) // August 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 7, 31)) // August 31, 2015
    })

    it('handles adding years to October 31', () => {
        const result = addYears(new Date(2014, 9, 31), 1) // October 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 9, 31)) // October 31, 2015
    })

    it('handles adding years to December 31', () => {
        const result = addYears(new Date(2014, 11, 31), 1) // December 31, 2014 + 1 year
        expect(result).toEqual(new Date(2015, 11, 31)) // December 31, 2015
    })

    // Multiple leap year cycles
    it('handles multiple leap year cycles (4 years)', () => {
        const result = addYears(new Date(2020, 1, 29), 4) // February 29, 2020 + 4 years
        expect(result).toEqual(new Date(2024, 1, 29)) // February 29, 2024
    })

    it('handles multiple leap year cycles (8 years)', () => {
        const result = addYears(new Date(2020, 1, 29), 8) // February 29, 2020 + 8 years
        expect(result).toEqual(new Date(2028, 1, 29)) // February 29, 2028
    })

    it('handles subtraction across multiple leap year cycles', () => {
        const result = addYears(new Date(2028, 1, 29), -8) // February 29, 2028 - 8 years
        expect(result).toEqual(new Date(2020, 1, 29)) // February 29, 2020
    })

    // Historical dates
    it('handles dates before 1900', () => {
        const result = addYears(new Date(1850, 6, 15), 50)
        expect(result).toEqual(new Date(1900, 6, 15))
    })

    it('handles very old dates', () => {
        const result = addYears(new Date(1000, 0, 1), 1000)
        expect(result).toEqual(new Date(2000, 0, 1))
    })

    // Future dates
    it('handles far future dates', () => {
        const result = addYears(new Date(2100, 6, 15), 100)
        expect(result).toEqual(new Date(2200, 6, 15))
    })

    // Special leap year rules (divisible by 100 but not 400)
    it('handles year 1900 (not a leap year despite being divisible by 4)', () => {
        const result = addYears(new Date(1899, 1, 28), 1) // February 28, 1899 + 1 year
        expect(result).toEqual(new Date(1900, 1, 28)) // February 28, 1900
    })

    it('handles year 2100 (not a leap year despite being divisible by 4)', () => {
        const result = addYears(new Date(2099, 1, 28), 1) // February 28, 2099 + 1 year
        expect(result).toEqual(new Date(2100, 1, 28)) // February 28, 2100
    })

    it('handles year 2000 (is a leap year because divisible by 400)', () => {
        const result = addYears(new Date(1999, 1, 28), 1) // February 28, 1999 + 1 year
        expect(result).toEqual(new Date(2000, 1, 28)) // February 28, 2000
    })
})