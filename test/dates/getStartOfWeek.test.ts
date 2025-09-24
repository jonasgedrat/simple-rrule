import { describe, it, expect } from 'vitest'
import { getStartOfWeekWithoutChangeTime } from '../../src/dates/getStartOfWeek'
import { Weekday } from '../../src/types'

describe('getStartOfWeekWithoutChangeTime', () => {
    // Test with Monday as week start (most common in business)
    describe('when week starts on Monday', () => {
        const wkst: Weekday = 'MO'

        it('should return Monday when input is Monday', () => {
            const monday = new Date('2024-01-15T10:30:45.123Z') // Monday
            const result = getStartOfWeekWithoutChangeTime(monday, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-01-15T10:30:45.123Z')
        })

        it('should return previous Monday when input is Tuesday', () => {
            const tuesday = new Date('2024-01-16T14:20:30.456Z') // Tuesday
            const result = getStartOfWeekWithoutChangeTime(tuesday, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-01-15T14:20:30.456Z')
        })

        it('should return previous Monday when input is Sunday', () => {
            const sunday = new Date('2024-01-21T08:15:22.789Z') // Sunday
            const result = getStartOfWeekWithoutChangeTime(sunday, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-01-15T08:15:22.789Z')
        })

        it('should return same Monday when input is Friday', () => {
            const friday = new Date('2024-01-19T16:45:10.000Z') // Friday
            const result = getStartOfWeekWithoutChangeTime(friday, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-01-15T16:45:10.000Z')
        })
    })

    // Test with Sunday as week start (common in US)
    describe('when week starts on Sunday', () => {
        const wkst: Weekday = 'SU'

        it('should return Sunday when input is Sunday', () => {
            const sunday = new Date('2024-01-14T12:00:00.000Z') // Sunday
            const result = getStartOfWeekWithoutChangeTime(sunday, wkst)
            
            expect(result.getDay()).toBe(0) // Sunday
            expect(result.toISOString()).toBe('2024-01-14T12:00:00.000Z')
        })

        it('should return same Sunday when input is Wednesday', () => {
            const wednesday = new Date('2024-01-17T09:30:15.250Z') // Wednesday
            const result = getStartOfWeekWithoutChangeTime(wednesday, wkst)
            
            expect(result.getDay()).toBe(0) // Sunday
            expect(result.toISOString()).toBe('2024-01-14T09:30:15.250Z')
        })

        it('should return same Sunday when input is Saturday', () => {
            const saturday = new Date('2024-01-20T23:59:59.999Z') // Saturday
            const result = getStartOfWeekWithoutChangeTime(saturday, wkst)
            
            expect(result.getDay()).toBe(0) // Sunday
            expect(result.toISOString()).toBe('2024-01-14T23:59:59.999Z')
        })
    })

    // Test with different weekdays as week start
    describe('when week starts on different days', () => {
        it('should handle Tuesday as week start', () => {
            const wkst: Weekday = 'TU'
            const friday = new Date('2024-01-19T15:30:00.000Z') // Friday
            const result = getStartOfWeekWithoutChangeTime(friday, wkst)
            
            expect(result.getDay()).toBe(2) // Tuesday
            expect(result.toISOString()).toBe('2024-01-16T15:30:00.000Z')
        })

        it('should handle Wednesday as week start', () => {
            const wkst: Weekday = 'WE'
            const monday = new Date('2024-01-15T11:45:30.500Z') // Monday
            const result = getStartOfWeekWithoutChangeTime(monday, wkst)
            
            expect(result.getDay()).toBe(3) // Wednesday
            expect(result.toISOString()).toBe('2024-01-10T11:45:30.500Z')
        })

        it('should handle Thursday as week start', () => {
            const wkst: Weekday = 'TH'
            const sunday = new Date('2024-01-21T06:00:00.000Z') // Sunday
            const result = getStartOfWeekWithoutChangeTime(sunday, wkst)
            
            expect(result.getDay()).toBe(4) // Thursday
            expect(result.toISOString()).toBe('2024-01-18T06:00:00.000Z')
        })

        it('should handle Friday as week start', () => {
            const wkst: Weekday = 'FR'
            const tuesday = new Date('2024-01-16T20:15:45.750Z') // Tuesday
            const result = getStartOfWeekWithoutChangeTime(tuesday, wkst)
            
            expect(result.getDay()).toBe(5) // Friday
            expect(result.toISOString()).toBe('2024-01-12T20:15:45.750Z')
        })

        it('should handle Saturday as week start', () => {
            const wkst: Weekday = 'SA'
            const thursday = new Date('2024-01-18T13:22:11.333Z') // Thursday
            const result = getStartOfWeekWithoutChangeTime(thursday, wkst)
            
            expect(result.getDay()).toBe(6) // Saturday
            expect(result.toISOString()).toBe('2024-01-13T13:22:11.333Z')
        })
    })

    // Test edge cases and boundary conditions
    describe('edge cases and boundary conditions', () => {
        it('should handle month boundary correctly', () => {
            const wkst: Weekday = 'MO'
            const firstDayOfMonth = new Date('2024-02-01T12:00:00.000Z') // Thursday, Feb 1st
            const result = getStartOfWeekWithoutChangeTime(firstDayOfMonth, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-01-29T12:00:00.000Z') // Previous Monday in January
        })

        it('should handle year boundary correctly', () => {
            const wkst: Weekday = 'SU'
            const newYearDay = new Date('2024-01-01T00:00:00.000Z') // Sunday, Jan 1st
            const result = getStartOfWeekWithoutChangeTime(newYearDay, wkst)
            
            expect(result.getDay()).toBe(0) // Sunday
            expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z') // Same day since it's already Sunday
        })

        it('should handle leap year February correctly', () => {
            const wkst: Weekday = 'MO'
            const leapDay = new Date('2024-02-29T18:30:00.000Z') // Thursday, Feb 29th (leap year)
            const result = getStartOfWeekWithoutChangeTime(leapDay, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.toISOString()).toBe('2024-02-26T18:30:00.000Z')
        })

        it('should preserve exact time including milliseconds', () => {
            const wkst: Weekday = 'MO'
            const preciseTime = new Date('2024-01-17T23:59:59.999Z') // Wednesday with precise time
            const result = getStartOfWeekWithoutChangeTime(preciseTime, wkst)
            
            expect(result.getDay()).toBe(1) // Monday
            expect(result.getMilliseconds()).toBe(999)
            expect(result.getSeconds()).toBe(59)
            expect(result.getMinutes()).toBe(59)
            expect(result.getUTCHours()).toBe(23) // Use UTC hours to avoid timezone issues
            // Wednesday (day 3) with Monday start (day 1): diff = (3 < 1 ? 7 : 0) + 3 - 1 = 0 + 3 - 1 = 2, so go back 2 days
            expect(result.toISOString()).toBe('2024-01-15T23:59:59.999Z')
        })
    })

    // Test all weekdays as input with Monday start
    describe('comprehensive weekday testing with Monday start', () => {
        const wkst: Weekday = 'MO'
        const baseTime = 'T15:45:30.123Z'

        it('should handle all days of the week correctly', () => {
            const testCases = [
                { day: 'Sunday', date: new Date(`2024-01-21${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Monday', date: new Date(`2024-01-15${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Tuesday', date: new Date(`2024-01-16${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Wednesday', date: new Date(`2024-01-17${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Thursday', date: new Date(`2024-01-18${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Friday', date: new Date(`2024-01-19${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) },
                { day: 'Saturday', date: new Date(`2024-01-20${baseTime}`), expectedStart: new Date(`2024-01-15${baseTime}`) }
            ]

            testCases.forEach(({ day, date, expectedStart }) => {
                const result = getStartOfWeekWithoutChangeTime(date, wkst)
                expect(result.toISOString()).toBe(expectedStart.toISOString())
                expect(result.getDay()).toBe(1) // All should return Monday
            })
        })
    })

    // Test all weekdays as input with Sunday start
    describe('comprehensive weekday testing with Sunday start', () => {
        const wkst: Weekday = 'SU'
        const baseTime = 'T08:20:15.456Z'

        it('should handle all days of the week correctly', () => {
            const testCases = [
                { day: 'Sunday', date: new Date(`2024-01-14${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Monday', date: new Date(`2024-01-15${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Tuesday', date: new Date(`2024-01-16${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Wednesday', date: new Date(`2024-01-17${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Thursday', date: new Date(`2024-01-18${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Friday', date: new Date(`2024-01-19${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) },
                { day: 'Saturday', date: new Date(`2024-01-20${baseTime}`), expectedStart: new Date(`2024-01-14${baseTime}`) }
            ]

            testCases.forEach(({ day, date, expectedStart }) => {
                const result = getStartOfWeekWithoutChangeTime(date, wkst)
                expect(result.toISOString()).toBe(expectedStart.toISOString())
                expect(result.getDay()).toBe(0) // All should return Sunday
            })
        })
    })

    // Test mathematical correctness of the algorithm
    describe('algorithm correctness', () => {
        it('should correctly calculate when current day is before week start', () => {
            const wkst: Weekday = 'WE' // Wednesday start
            const monday = new Date('2024-01-15T12:00:00.000Z') // Monday (day 1)
            const result = getStartOfWeekWithoutChangeTime(monday, wkst)
            
            // Monday (1) < Wednesday (3), so should go to previous Wednesday
            expect(result.getDay()).toBe(3) // Wednesday
            expect(result.toISOString()).toBe('2024-01-10T12:00:00.000Z')
        })

        it('should correctly calculate when current day is after week start', () => {
            const wkst: Weekday = 'TU' // Tuesday start
            const friday = new Date('2024-01-19T12:00:00.000Z') // Friday (day 5)
            const result = getStartOfWeekWithoutChangeTime(friday, wkst)
            
            // Friday (5) > Tuesday (2), so should go to current week's Tuesday
            expect(result.getDay()).toBe(2) // Tuesday
            expect(result.toISOString()).toBe('2024-01-16T12:00:00.000Z')
        })

        it('should handle wrap-around calculation correctly', () => {
            const wkst: Weekday = 'SA' // Saturday start
            const tuesday = new Date('2024-01-16T12:00:00.000Z') // Tuesday (day 2)
            const result = getStartOfWeekWithoutChangeTime(tuesday, wkst)
            
            // Tuesday (2) < Saturday (6), so should go to previous Saturday
            expect(result.getDay()).toBe(6) // Saturday
            expect(result.toISOString()).toBe('2024-01-13T12:00:00.000Z')
        })
    })

    // Test timezone handling
    describe('timezone handling', () => {
        it('should work correctly with different UTC times', () => {
            const wkst: Weekday = 'MO'
            
            // Sunday Jan 14, 2024 - should go back to Monday Jan 8, 2024
            const earlyMorning = new Date('2024-01-14T01:00:00.000Z') // Saturday early morning
            const lateEvening = new Date('2024-01-14T23:00:00.000Z') // Sunday late evening
            
            const result1 = getStartOfWeekWithoutChangeTime(earlyMorning, wkst)
            const result2 = getStartOfWeekWithoutChangeTime(lateEvening, wkst)
            
            // Both should return the same Monday, with same times
            expect(result1.getDay()).toBe(1)
            expect(result2.getDay()).toBe(1)
            // Saturday (day 6) with Monday start (day 1): diff = (6 < 1 ? 7 : 0) + 6 - 1 = 0 + 6 - 1 = 5, so go back 5 days
            // Sunday (day 0) with Monday start (day 1): diff = (0 < 1 ? 7 : 0) + 0 - 1 = 7 + 0 - 1 = 6, so go back 6 days
            expect(result1.toISOString()).toBe('2024-01-09T01:00:00.000Z')
            expect(result2.toISOString()).toBe('2024-01-08T23:00:00.000Z')
        })
    })
})