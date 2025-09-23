import { describe, it, expect } from 'vitest'
import { isBefore, isLastDayOfMonth, compareAsc } from '../../src/dates'

describe('isBefore', () => {
    it('should return true when first date is before second date', () => {
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2021-01-08T00:00:00.000Z')
            )
        ).toEqual(true)

        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-02-08T00:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-09T00:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T01:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:02:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:03.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.004Z')
            )
        ).toEqual(true)
    })

    it('should return false when first date is after second date', () => {
        expect(
            isBefore(
                new Date('2021-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.000Z')
            )
        ).toEqual(false)

        expect(
            isBefore(
                new Date('2020-02-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.000Z')
            )
        ).toEqual(false)
    })

    it('should return true when dates are equal (note: function uses <= comparison)', () => {
        const date = new Date('2020-01-08T00:00:00.000Z')
        expect(isBefore(date, date)).toEqual(true)
        
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.000Z')
            )
        ).toEqual(true)
    })

    it('should handle invalid dates', () => {
        const invalidDate = new Date('invalid')
        const validDate = new Date('2020-01-08T00:00:00.000Z')
        
        expect(isBefore(invalidDate, validDate)).toEqual(false)
        expect(isBefore(validDate, invalidDate)).toEqual(false)
        expect(isBefore(invalidDate, invalidDate)).toEqual(false)
    })

    it('should handle edge cases with millisecond precision', () => {
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.001Z')
            )
        ).toEqual(true)

        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.001Z'),
                new Date('2020-01-08T00:00:00.000Z')
            )
        ).toEqual(false)
    })
})

describe('isLastDayOfMonth', () => {
    it('should return true for the last day of January', () => {
        expect(isLastDayOfMonth(new Date(2020, 0, 31))).toEqual(true) // January 31
        expect(isLastDayOfMonth(new Date(2020, 0, 31, 12, 30, 45))).toEqual(true) // With time
    })

    it('should return true for the last day of February in non-leap year', () => {
        expect(isLastDayOfMonth(new Date(2021, 1, 28))).toEqual(true) // February 28, 2021
        expect(isLastDayOfMonth(new Date(2021, 1, 28, 23, 59, 59))).toEqual(true) // With time
    })

    it('should return true for the last day of February in leap year', () => {
        expect(isLastDayOfMonth(new Date(2020, 1, 29))).toEqual(true) // February 29, 2020
        expect(isLastDayOfMonth(new Date(2020, 1, 29, 0, 0, 0))).toEqual(true) // With time
    })

    it('should return false for February 28 in leap year', () => {
        expect(isLastDayOfMonth(new Date(2020, 1, 28))).toEqual(false) // February 28, 2020 (leap year)
    })

    it('should return false for February 29 in non-leap year', () => {
        // Note: This creates March 1st due to invalid date
        const invalidFeb29 = new Date(2021, 1, 29)
        expect(isLastDayOfMonth(invalidFeb29)).toEqual(false)
    })

    it('should return true for the last day of months with 30 days', () => {
        expect(isLastDayOfMonth(new Date(2020, 3, 30))).toEqual(true) // April 30
        expect(isLastDayOfMonth(new Date(2020, 5, 30))).toEqual(true) // June 30
        expect(isLastDayOfMonth(new Date(2020, 8, 30))).toEqual(true) // September 30
        expect(isLastDayOfMonth(new Date(2020, 10, 30))).toEqual(true) // November 30
    })

    it('should return true for the last day of months with 31 days', () => {
        expect(isLastDayOfMonth(new Date(2020, 0, 31))).toEqual(true) // January 31
        expect(isLastDayOfMonth(new Date(2020, 2, 31))).toEqual(true) // March 31
        expect(isLastDayOfMonth(new Date(2020, 4, 31))).toEqual(true) // May 31
        expect(isLastDayOfMonth(new Date(2020, 6, 31))).toEqual(true) // July 31
        expect(isLastDayOfMonth(new Date(2020, 7, 31))).toEqual(true) // August 31
        expect(isLastDayOfMonth(new Date(2020, 9, 31))).toEqual(true) // October 31
        expect(isLastDayOfMonth(new Date(2020, 11, 31))).toEqual(true) // December 31
    })

    it('should return false for non-last days of the month', () => {
        expect(isLastDayOfMonth(new Date(2020, 0, 30))).toEqual(false) // January 30
        expect(isLastDayOfMonth(new Date(2020, 1, 27))).toEqual(false) // February 27
        expect(isLastDayOfMonth(new Date(2020, 3, 29))).toEqual(false) // April 29
        expect(isLastDayOfMonth(new Date(2020, 11, 30))).toEqual(false) // December 30
    })

    it('should return false for the first day of the month', () => {
        expect(isLastDayOfMonth(new Date(2020, 0, 1))).toEqual(false) // January 1
        expect(isLastDayOfMonth(new Date(2020, 5, 1))).toEqual(false) // June 1
        expect(isLastDayOfMonth(new Date(2020, 11, 1))).toEqual(false) // December 1
    })

    it('should handle different years correctly', () => {
        expect(isLastDayOfMonth(new Date(2019, 1, 28))).toEqual(true) // February 28, 2019
        expect(isLastDayOfMonth(new Date(2024, 1, 29))).toEqual(true) // February 29, 2024 (leap year)
        expect(isLastDayOfMonth(new Date(1900, 1, 28))).toEqual(true) // February 28, 1900 (not leap year)
        expect(isLastDayOfMonth(new Date(2000, 1, 29))).toEqual(true) // February 29, 2000 (leap year)
    })

    it('should handle invalid dates', () => {
        const invalidDate = new Date('invalid')
        expect(isLastDayOfMonth(invalidDate)).toEqual(false)
    })

    it('should preserve time precision when checking', () => {
        expect(isLastDayOfMonth(new Date(2020, 0, 31, 0, 0, 0, 0))).toEqual(true)
        expect(isLastDayOfMonth(new Date(2020, 0, 31, 23, 59, 59, 999))).toEqual(true)
        expect(isLastDayOfMonth(new Date(2020, 0, 31, 12, 30, 45, 123))).toEqual(true)
    })
})

describe('compareAsc', () => {
    it('should return -1 when first date is before second date', () => {
        expect(
            compareAsc(
                new Date(1987, 1, 11),
                new Date(1989, 6, 10)
            )
        ).toEqual(-1)

        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.000Z'),
                new Date('2020-01-01T00:00:00.001Z')
            )
        ).toEqual(-1)
    })

    it('should return 1 when first date is after second date', () => {
        expect(
            compareAsc(
                new Date(1989, 6, 10),
                new Date(1987, 1, 11)
            )
        ).toEqual(1)

        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.001Z'),
                new Date('2020-01-01T00:00:00.000Z')
            )
        ).toEqual(1)
    })

    it('should return 0 when dates are equal', () => {
        const date = new Date(2020, 0, 1)
        expect(compareAsc(date, date)).toEqual(0)

        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.000Z'),
                new Date('2020-01-01T00:00:00.000Z')
            )
        ).toEqual(0)
    })

    it('should work correctly for sorting arrays', () => {
        const dates = [
            new Date(1995, 6, 2),
            new Date(1987, 1, 11),
            new Date(1989, 6, 10)
        ]
        
        const sorted = dates.sort(compareAsc)
        
        expect(sorted[0]).toEqual(new Date(1987, 1, 11))
        expect(sorted[1]).toEqual(new Date(1989, 6, 10))
        expect(sorted[2]).toEqual(new Date(1995, 6, 2))
    })

    it('should handle invalid dates correctly', () => {
        const invalidDate = new Date('invalid')
        const validDate = new Date('2020-01-01T00:00:00.000Z')
        
        // Invalid dates have NaN getTime(), so diff will be NaN
        expect(compareAsc(invalidDate, validDate)).toBeNaN()
        expect(compareAsc(validDate, invalidDate)).toBeNaN()
        expect(compareAsc(invalidDate, invalidDate)).toBeNaN()
    })

    it('should handle edge cases with millisecond precision', () => {
        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.000Z'),
                new Date('2020-01-01T00:00:00.001Z')
            )
        ).toEqual(-1)

        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.002Z'),
                new Date('2020-01-01T00:00:00.001Z')
            )
        ).toEqual(1)
    })

    it('should handle dates across different years', () => {
        expect(
            compareAsc(
                new Date(2019, 11, 31, 23, 59, 59, 999),
                new Date(2020, 0, 1, 0, 0, 0, 0)
            )
        ).toEqual(-1)
    })

    it('should handle dates with different timezones consistently', () => {
        // Both dates represent the same moment in time
        expect(
            compareAsc(
                new Date('2020-01-01T00:00:00.000Z'),
                new Date('2020-01-01T00:00:00.000+00:00')
            )
        ).toEqual(0)
    })

    it('should handle leap year dates', () => {
        expect(
            compareAsc(
                new Date(2020, 1, 28), // February 28, 2020
                new Date(2020, 1, 29)  // February 29, 2020 (leap year)
            )
        ).toEqual(-1)

        expect(
            compareAsc(
                new Date(2021, 1, 28), // February 28, 2021
                new Date(2021, 2, 1)   // March 1, 2021
            )
        ).toEqual(-1)
    })

    it('should handle very old and future dates', () => {
        expect(
            compareAsc(
                new Date(1900, 0, 1),
                new Date(2100, 0, 1)
            )
        ).toEqual(-1)

        expect(
            compareAsc(
                new Date(2100, 0, 1),
                new Date(1900, 0, 1)
            )
        ).toEqual(1)
    })
})
