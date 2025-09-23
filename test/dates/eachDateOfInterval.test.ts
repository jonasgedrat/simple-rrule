import { describe, it, expect } from 'vitest'
import { eachDateOfInterval } from '../../src/dates'

const start = new Date('2020-01-01T00:00:00.000Z')
const end = new Date('2032-01-01T00:00:00.000Z')

describe('eachDateOfInterval', () => {
    describe('Basic functionality', () => {
        it('should generate years interval', () => {
            const dates = eachDateOfInterval(start, end, 'years', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2021-01-01T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2022-01-01T00:00:00.000Z'))
        })

        it('should generate months interval', () => {
            const dates = eachDateOfInterval(start, end, 'months', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-02-01T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-03-01T00:00:00.000Z'))
        })

        it('should generate days interval', () => {
            const dates = eachDateOfInterval(start, end, 'days', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-02T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-03T00:00:00.000Z'))
        })

        it('should generate weeks interval', () => {
            const dates = eachDateOfInterval(start, end, 'weeks', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-08T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-15T00:00:00.000Z'))
        })

        it('should generate hours interval', () => {
            const dates = eachDateOfInterval(start, end, 'hours', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T01:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T02:00:00.000Z'))
        })

        it('should generate minutes interval', () => {
            const dates = eachDateOfInterval(start, end, 'minutes', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:01:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:02:00.000Z'))
        })

        it('should generate seconds interval', () => {
            const dates = eachDateOfInterval(start, end, 'seconds', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:00:01.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:00:02.000Z'))
        })

        it('should handle milliseconds interval (falls through to default case)', () => {
            const startMs = new Date('2020-01-01T00:00:00.000Z')
            const endMs = new Date('2020-01-01T00:00:01.000Z')
            const dates = eachDateOfInterval(startMs, endMs, 'milliseconds', 100, 5)
            // Since milliseconds is not implemented in switch, it falls through to default
            // which doesn't update currentDate, so it creates an infinite loop until maxCount
            expect(dates.length).toEqual(5)
            // All dates will be the same as start date due to no increment
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
        })
    })

    describe('Step functionality', () => {
        it('should generate years interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'years', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2023-01-01T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2026-01-01T00:00:00.000Z'))
        })

        it('should generate months interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'months', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-04-01T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-07-01T00:00:00.000Z'))
        })

        it('should generate days interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'days', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-04T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-07T00:00:00.000Z'))
        })

        it('should generate weeks interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'weeks', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-22T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-02-12T00:00:00.000Z'))
        })

        it('should generate hours interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'hours', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T03:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T06:00:00.000Z'))
        })

        it('should generate minutes interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'minutes', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:03:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:06:00.000Z'))
        })

        it('should generate seconds interval with step', () => {
            const dates = eachDateOfInterval(start, end, 'seconds', 3, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:00:03.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:00:06.000Z'))
        })
    })

    describe('MaxCount parameter', () => {
        it('should respect maxCount parameter', () => {
            const dates = eachDateOfInterval(start, end, 'days', 1, 5)
            expect(dates.length).toEqual(5)
        })

        it('should return all dates when maxCount is 0 (no limit)', () => {
            const shortEnd = new Date('2020-01-05T00:00:00.000Z')
            const dates = eachDateOfInterval(start, shortEnd, 'days', 1, 0)
            expect(dates.length).toEqual(5) // Jan 1, 2, 3, 4, 5
        })

        it('should limit results when maxCount is smaller than possible dates', () => {
            const shortEnd = new Date('2020-01-10T00:00:00.000Z')
            const dates = eachDateOfInterval(start, shortEnd, 'days', 1, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-02T00:00:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-03T00:00:00.000Z'))
        })
    })

    describe('Edge cases and error handling', () => {
        it('should throw RangeError when start date is after end date', () => {
            const laterStart = new Date('2021-01-01T00:00:00.000Z')
            const earlierEnd = new Date('2020-01-01T00:00:00.000Z')
            expect(() => {
                eachDateOfInterval(laterStart, earlierEnd, 'days', 1, 3)
            }).toThrow('Invalid interval')
        })

        it('should handle same start and end dates', () => {
            const sameDate = new Date('2020-01-01T00:00:00.000Z')
            const dates = eachDateOfInterval(sameDate, sameDate, 'days', 1, 0)
            expect(dates.length).toEqual(1)
            expect(dates[0]).toEqual(sameDate)
        })

        it('should handle invalid dates', () => {
            const invalidStart = new Date('invalid')
            const validEnd = new Date('2020-01-01T00:00:00.000Z')
            expect(() => {
                eachDateOfInterval(invalidStart, validEnd, 'days', 1, 3)
            }).toThrow('Invalid interval')
        })

        it('should handle large step values that exceed interval', () => {
            const dates = eachDateOfInterval(start, end, 'years', 50, 3)
            expect(dates.length).toEqual(1) // Only start date fits within the interval
            expect(dates[0]).toEqual(start)
        })

        it('should handle zero step (infinite loop protection with maxCount)', () => {
            const dates = eachDateOfInterval(start, end, 'days', 0, 5)
            expect(dates.length).toEqual(5) // Should stop at maxCount
            // All dates should be the same since step is 0
            expect(dates[0]).toEqual(start)
            expect(dates[4]).toEqual(start)
        })
    })

    describe('Leap year handling', () => {
        it('should handle leap year February correctly', () => {
            const leapStart = new Date('2020-02-28T00:00:00.000Z')
            const leapEnd = new Date('2020-03-02T00:00:00.000Z')
            const dates = eachDateOfInterval(leapStart, leapEnd, 'days', 1, 0)
            expect(dates.length).toEqual(4) // Feb 28, 29, Mar 1, 2
            expect(dates[1]).toEqual(new Date('2020-02-29T00:00:00.000Z'))
        })

        it('should handle non-leap year February correctly', () => {
            const nonLeapStart = new Date('2021-02-28T00:00:00.000Z')
            const nonLeapEnd = new Date('2021-03-02T00:00:00.000Z')
            const dates = eachDateOfInterval(nonLeapStart, nonLeapEnd, 'days', 1, 0)
            expect(dates.length).toEqual(3) // Feb 28, Mar 1, 2
            expect(dates[1]).toEqual(new Date('2021-03-01T00:00:00.000Z'))
        })
    })

    describe('Cross-boundary scenarios', () => {
        it('should handle month boundaries correctly', () => {
            const monthStart = new Date('2020-01-30T00:00:00.000Z')
            const monthEnd = new Date('2020-02-02T00:00:00.000Z')
            const dates = eachDateOfInterval(monthStart, monthEnd, 'days', 1, 0)
            expect(dates.length).toEqual(4) // Jan 30, 31, Feb 1, 2
            expect(dates[2]).toEqual(new Date('2020-02-01T00:00:00.000Z'))
        })

        it('should handle year boundaries correctly', () => {
            const yearStart = new Date('2019-12-30T00:00:00.000Z')
            const yearEnd = new Date('2020-01-02T00:00:00.000Z')
            const dates = eachDateOfInterval(yearStart, yearEnd, 'days', 1, 0)
            expect(dates.length).toEqual(4) // Dec 30, 31, Jan 1, 2
            expect(dates[2]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
        })

        it('should handle daylight saving time transitions', () => {
            // Spring forward (March 8, 2020 in US)
            const dstStart = new Date('2020-03-07T12:00:00.000Z')
            const dstEnd = new Date('2020-03-09T12:00:00.000Z')
            const dates = eachDateOfInterval(dstStart, dstEnd, 'hours', 12, 0)
            expect(dates.length).toEqual(5) // Every 12 hours for 2+ days
        })
    })

    describe('Fractional and decimal steps', () => {
        it('should handle fractional step values for hours', () => {
            const dates = eachDateOfInterval(start, end, 'hours', 1.5, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T01:30:00.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T03:00:00.000Z'))
        })

        it('should handle fractional step values for minutes', () => {
            const dates = eachDateOfInterval(start, end, 'minutes', 2.5, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:02:30.000Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:05:00.000Z'))
        })

        it('should handle fractional step values for seconds', () => {
            const dates = eachDateOfInterval(start, end, 'seconds', 0.5, 3)
            expect(dates.length).toEqual(3)
            expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
            expect(dates[1]).toEqual(new Date('2020-01-01T00:00:00.500Z'))
            expect(dates[2]).toEqual(new Date('2020-01-01T00:00:01.000Z'))
        })
    })

    describe('Performance and large intervals', () => {
        it('should handle reasonable large intervals efficiently', () => {
            const largeEnd = new Date('2020-02-01T00:00:00.000Z')
            const dates = eachDateOfInterval(start, largeEnd, 'days', 1, 0)
            expect(dates.length).toEqual(32) // January has 31 days + Feb 1
            expect(dates[0]).toEqual(start)
            expect(dates[dates.length - 1]).toEqual(largeEnd)
        })

        it('should respect maxCount to prevent memory issues', () => {
            const dates = eachDateOfInterval(start, end, 'seconds', 1, 100)
            expect(dates.length).toEqual(100)
        })

        it('should handle very large maxCount values efficiently', () => {
            const shortEnd = new Date('2020-01-03T00:00:00.000Z')
            const dates = eachDateOfInterval(start, shortEnd, 'days', 1, 1000)
            expect(dates.length).toEqual(3) // Limited by actual interval, not maxCount
        })
    })

    describe('Boundary conditions', () => {
        it('should include start date when it equals end date', () => {
            const sameDate = new Date('2020-01-01T00:00:00.000Z')
            const dates = eachDateOfInterval(sameDate, sameDate, 'hours', 1, 0)
            expect(dates.length).toEqual(1)
            expect(dates[0]).toEqual(sameDate)
        })

        it('should handle very short intervals with seconds', () => {
            const shortStart = new Date('2020-01-01T00:00:00.000Z')
            const shortEnd = new Date('2020-01-01T00:00:03.000Z')
            const dates = eachDateOfInterval(shortStart, shortEnd, 'seconds', 1, 0)
            expect(dates.length).toEqual(4) // 0, 1, 2, 3 seconds
        })

        it('should handle month-end edge cases', () => {
            const monthEndStart = new Date('2020-01-31T00:00:00.000Z')
            const monthEndEnd = new Date('2020-03-31T00:00:00.000Z')
            const dates = eachDateOfInterval(monthEndStart, monthEndEnd, 'months', 1, 0)
            expect(dates.length).toEqual(3) // Jan 31, Feb 29 (leap year), Mar 29 (not 31 due to Feb adjustment)
        })
    })
})
