import { describe, it, expect } from 'vitest'
import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addWeeks,
    addYears,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
    differenceInMilliseconds,
    differenceInCalendarMonths,
} from '../../src/dates'

const _d = new Date('2020-01-01T00:00:00.000Z')

describe('differenceHelpers', () => {
    describe('differenceInYears', () => {
        it('should calculate basic year differences', () => {
            expect(differenceInYears(addYears(_d, 7), _d)).toEqual(7)
            expect(differenceInYears(_d, addYears(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInYears(_d, _d)).toEqual(0)
        })

        it('should handle leap year calculations correctly', () => {
            // February 29, 2020 to February 28, 2021 should be 0 years (not full year)
            expect(differenceInYears(new Date(2021, 1, 28), new Date(2020, 1, 29))).toEqual(0)
            
            // February 29, 2020 to March 1, 2021 should be 1 year
            expect(differenceInYears(new Date(2021, 2, 1), new Date(2020, 1, 29))).toEqual(1)
        })

        it('should handle partial years correctly', () => {
            // January 1, 2020 to December 31, 2020 should be 0 years
            expect(differenceInYears(new Date(2020, 11, 31), new Date(2020, 0, 1))).toEqual(0)
            
            // January 1, 2020 to January 1, 2021 should be 1 year
            expect(differenceInYears(new Date(2021, 0, 1), new Date(2020, 0, 1))).toEqual(1)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInYears(invalidDate, _d)).toBeNaN()
            expect(differenceInYears(_d, invalidDate)).toBeNaN()
        })

        it('should handle cross-century calculations', () => {
            expect(differenceInYears(new Date(2000, 0, 1), new Date(1999, 0, 1))).toEqual(1)
            expect(differenceInYears(new Date(1900, 0, 1), new Date(2000, 0, 1))).toEqual(-100)
        })
    })

    describe('differenceInMonths', () => {
        it('should calculate basic month differences', () => {
            expect(differenceInMonths(addMonths(_d, 7), _d)).toEqual(7)
            expect(differenceInMonths(_d, addMonths(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInMonths(_d, _d)).toEqual(0)
        })

        it('should handle partial months correctly', () => {
            // January 1 to January 31 should be 0 months
            expect(differenceInMonths(new Date(2020, 0, 31), new Date(2020, 0, 1))).toEqual(0)
            
            // January 1 to February 1 should be 1 month
            expect(differenceInMonths(new Date(2020, 1, 1), new Date(2020, 0, 1))).toEqual(1)
        })

        it('should handle end of month dates correctly', () => {
            // January 31 to February 29 (leap year) should be 1 month
            expect(differenceInMonths(new Date(2020, 1, 29), new Date(2020, 0, 31))).toEqual(1)
            
            // January 31 to February 28 (non-leap year) should be 1 month
            expect(differenceInMonths(new Date(2021, 1, 28), new Date(2021, 0, 31))).toEqual(1)
        })

        it('should handle February edge cases', () => {
            // February 28 to March 28 should be 1 month
            expect(differenceInMonths(new Date(2021, 2, 28), new Date(2021, 1, 28))).toEqual(1)
            
            // February 29 (leap year) to March 29 should be 1 month
            expect(differenceInMonths(new Date(2020, 2, 29), new Date(2020, 1, 29))).toEqual(1)
        })

        it('should handle cross-year calculations', () => {
            expect(differenceInMonths(new Date(2021, 0, 1), new Date(2020, 11, 1))).toEqual(1)
            expect(differenceInMonths(new Date(2021, 5, 15), new Date(2020, 0, 15))).toEqual(17)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInMonths(invalidDate, _d)).toBeNaN()
            expect(differenceInMonths(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInWeeks', () => {
        it('should calculate basic week differences', () => {
            expect(differenceInWeeks(addWeeks(_d, 7), _d)).toEqual(7)
            expect(differenceInWeeks(_d, addWeeks(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInWeeks(_d, _d)).toEqual(0)
        })

        it('should handle fractional weeks', () => {
            // 3.5 days should be 0.5 weeks
            expect(differenceInWeeks(addDays(_d, 3.5), _d)).toEqual(0.5)
            
            // 10 days should be approximately 1.43 weeks
            expect(differenceInWeeks(addDays(_d, 10), _d)).toBeCloseTo(1.4285714285714286)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInWeeks(invalidDate, _d)).toBeNaN()
            expect(differenceInWeeks(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInDays', () => {
        it('should calculate basic day differences', () => {
            expect(differenceInDays(addDays(_d, 7), _d)).toEqual(7)
            expect(differenceInDays(_d, addDays(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInDays(_d, _d)).toEqual(0)
        })

        it('should handle fractional days', () => {
            // 12 hours should be 0.5 days
            expect(differenceInDays(addHours(_d, 12), _d)).toEqual(0.5)
            
            // 36 hours should be 1.5 days
            expect(differenceInDays(addHours(_d, 36), _d)).toEqual(1.5)
        })

        it('should handle daylight saving time transitions', () => {
            // This test assumes the dates handle DST correctly
            const beforeDST = new Date(2020, 2, 7) // March 7, 2020
            const afterDST = new Date(2020, 2, 9)  // March 9, 2020
            expect(differenceInDays(afterDST, beforeDST)).toEqual(2)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInDays(invalidDate, _d)).toBeNaN()
            expect(differenceInDays(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInHours', () => {
        it('should calculate basic hour differences', () => {
            expect(differenceInHours(addHours(_d, 7), _d)).toEqual(7)
            expect(differenceInHours(_d, addHours(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInHours(_d, _d)).toEqual(0)
        })

        it('should handle fractional hours', () => {
            // 30 minutes should be 0.5 hours
            expect(differenceInHours(addMinutes(_d, 30), _d)).toEqual(0.5)
            
            // 90 minutes should be 1.5 hours
            expect(differenceInHours(addMinutes(_d, 90), _d)).toEqual(1.5)
        })

        it('should handle large hour differences', () => {
            // 25 hours (more than a day)
            expect(differenceInHours(addHours(_d, 25), _d)).toEqual(25)
            
            // 168 hours (1 week)
            expect(differenceInHours(addHours(_d, 168), _d)).toEqual(168)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInHours(invalidDate, _d)).toBeNaN()
            expect(differenceInHours(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInMinutes', () => {
        it('should calculate basic minute differences', () => {
            expect(differenceInMinutes(addMinutes(_d, 7), _d)).toEqual(7)
            expect(differenceInMinutes(_d, addMinutes(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInMinutes(_d, _d)).toEqual(0)
        })

        it('should handle fractional minutes', () => {
            // 30 seconds should be 0.5 minutes
            expect(differenceInMinutes(addSeconds(_d, 30), _d)).toEqual(0.5)
            
            // 90 seconds should be 1.5 minutes
            expect(differenceInMinutes(addSeconds(_d, 90), _d)).toEqual(1.5)
        })

        it('should handle large minute differences', () => {
            // 61 minutes (more than an hour)
            expect(differenceInMinutes(addMinutes(_d, 61), _d)).toEqual(61)
            
            // 1440 minutes (1 day)
            expect(differenceInMinutes(addMinutes(_d, 1440), _d)).toEqual(1440)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInMinutes(invalidDate, _d)).toBeNaN()
            expect(differenceInMinutes(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInSeconds', () => {
        it('should calculate basic second differences', () => {
            expect(differenceInSeconds(addSeconds(_d, 7), _d)).toEqual(7)
            expect(differenceInSeconds(_d, addSeconds(_d, 7))).toEqual(-7)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInSeconds(_d, _d)).toEqual(0)
        })

        it('should handle fractional seconds', () => {
            // 500 milliseconds should be 0.5 seconds
            const date1 = new Date(_d.getTime() + 500)
            expect(differenceInSeconds(date1, _d)).toEqual(0.5)
            
            // 1500 milliseconds should be 1.5 seconds
            const date2 = new Date(_d.getTime() + 1500)
            expect(differenceInSeconds(date2, _d)).toEqual(1.5)
        })

        it('should handle large second differences', () => {
            // 61 seconds (more than a minute)
            expect(differenceInSeconds(addSeconds(_d, 61), _d)).toEqual(61)
            
            // 3600 seconds (1 hour)
            expect(differenceInSeconds(addSeconds(_d, 3600), _d)).toEqual(3600)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInSeconds(invalidDate, _d)).toBeNaN()
            expect(differenceInSeconds(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInMilliseconds', () => {
        it('should calculate basic millisecond differences', () => {
            const date1 = new Date(_d.getTime() + 1000)
            expect(differenceInMilliseconds(date1, _d)).toEqual(1000)
            expect(differenceInMilliseconds(_d, date1)).toEqual(-1000)
        })

        it('should return 0 for same dates', () => {
            expect(differenceInMilliseconds(_d, _d)).toEqual(0)
        })

        it('should handle precise millisecond differences', () => {
            const date1 = new Date(_d.getTime() + 1)
            expect(differenceInMilliseconds(date1, _d)).toEqual(1)
            
            const date2 = new Date(_d.getTime() + 999)
            expect(differenceInMilliseconds(date2, _d)).toEqual(999)
        })

        it('should handle large millisecond differences', () => {
            // 1 day in milliseconds
            const oneDayMs = 24 * 60 * 60 * 1000
            const date1 = new Date(_d.getTime() + oneDayMs)
            expect(differenceInMilliseconds(date1, _d)).toEqual(oneDayMs)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInMilliseconds(invalidDate, _d)).toBeNaN()
            expect(differenceInMilliseconds(_d, invalidDate)).toBeNaN()
        })
    })

    describe('differenceInCalendarMonths', () => {
        it('should calculate basic calendar month differences', () => {
            // January to September (8 calendar months)
            expect(differenceInCalendarMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))).toEqual(8)
        })

        it('should return 0 for same month', () => {
            expect(differenceInCalendarMonths(new Date(2020, 0, 31), new Date(2020, 0, 1))).toEqual(0)
        })

        it('should handle cross-year calculations', () => {
            // December 2019 to January 2020 should be 1 calendar month
            expect(differenceInCalendarMonths(new Date(2020, 0, 1), new Date(2019, 11, 31))).toEqual(1)
            
            // January 2020 to December 2020 should be 11 calendar months
            expect(differenceInCalendarMonths(new Date(2020, 11, 1), new Date(2020, 0, 1))).toEqual(11)
        })

        it('should handle negative differences', () => {
            // Earlier date first should give negative result
            expect(differenceInCalendarMonths(new Date(2020, 0, 1), new Date(2020, 5, 1))).toEqual(-5)
        })

        it('should handle multi-year differences', () => {
            // 2 years and 3 months = 27 calendar months
            expect(differenceInCalendarMonths(new Date(2022, 3, 1), new Date(2020, 0, 1))).toEqual(27)
        })

        it('should ignore day differences within the same calendar month', () => {
            // Same month, different days should be 0
            expect(differenceInCalendarMonths(new Date(2020, 5, 30), new Date(2020, 5, 1))).toEqual(0)
        })

        it('should handle invalid dates', () => {
            const invalidDate = new Date('invalid')
            expect(differenceInCalendarMonths(invalidDate, _d)).toBeNaN()
            expect(differenceInCalendarMonths(_d, invalidDate)).toBeNaN()
        })
    })
})
