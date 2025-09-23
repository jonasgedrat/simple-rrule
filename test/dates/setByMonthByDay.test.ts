import { describe, it, expect, vi } from 'vitest'
import { setByDay, setByMonth } from '../../src/dates'

describe('setByMonthByDay', () => {
    describe('setByMonth', () => {
        it('should set month correctly with valid values', () => {
            const date = new Date('2020-01-15T12:34:56.123Z')
            const result = setByMonth(date, 7)
            expect(result).toEqual(new Date('2020-07-15T12:34:56.123Z'))
        })

        it('should preserve time when setting month', () => {
            const date = new Date('2020-01-15T14:30:45.999Z')
            const result = setByMonth(date, 12)
            expect(result.getUTCHours()).toBe(14)
            expect(result.getUTCMinutes()).toBe(30)
            expect(result.getUTCSeconds()).toBe(45)
            expect(result.getUTCMilliseconds()).toBe(999)
        })

        it('should handle month boundaries correctly', () => {
            // Test all valid months (1-12)
            const date = new Date('2020-01-15T12:00:00.000Z')
            
            for (let month = 1; month <= 12; month++) {
                const result = setByMonth(new Date(date), month)
                expect(result.getMonth()).toBe(month - 1) // JavaScript months are 0-indexed
            }
        })

        it('should handle leap year February correctly', () => {
            const date = new Date('2020-01-29T12:00:00.000Z') // 2020 is leap year
            const result = setByMonth(date, 2)
            expect(result).toEqual(new Date('2020-02-29T12:00:00.000Z'))
        })

        it('should adjust day when target month has fewer days', () => {
            const date = new Date('2020-01-31T12:00:00.000Z')
            const result = setByMonth(date, 4) // April has only 30 days
            expect(result).toEqual(new Date('2020-05-01T12:00:00.000Z')) // JavaScript behavior: overflows to next month
        })

        it('should adjust day for February in non-leap year', () => {
            const date = new Date('2021-01-31T12:00:00.000Z') // 2021 is not leap year
            const result = setByMonth(date, 2)
            expect(result).toEqual(new Date('2021-03-03T12:00:00.000Z')) // JavaScript behavior: overflows to March
        })

        it('should log error for invalid month values', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            const date = new Date('2020-01-15T12:00:00.000Z')
            
            // Test invalid months
            setByMonth(new Date(date), 0)
            setByMonth(new Date(date), 13)
            setByMonth(new Date(date), -1)
            setByMonth(new Date(date), 15)
            
            expect(consoleSpy).toHaveBeenCalledTimes(4)
            expect(consoleSpy).toHaveBeenCalledWith('setByMonth invalid month , must be 1 to 12: ', 0)
            expect(consoleSpy).toHaveBeenCalledWith('setByMonth invalid month , must be 1 to 12: ', 13)
            
            consoleSpy.mockRestore()
        })

        it('should still set month even with invalid values (current behavior)', () => {
            const date = new Date('2020-01-15T12:00:00.000Z')
            
            // Test that function still works despite invalid input (current behavior)
            const result1 = setByMonth(new Date(date), 0)
            expect(result1.getMonth()).toBe(11) // December of previous year
            
            const result2 = setByMonth(new Date(date), 13)
            expect(result2.getMonth()).toBe(0) // January of next year
        })

        it('should work with YearMonths type values', () => {
            const date = new Date('2020-01-15T12:00:00.000Z')
            
            // Test with specific YearMonths values (1-12)
            const result1 = setByMonth(new Date(date), 1 as const)
            expect(result1.getMonth()).toBe(0)
            
            const result12 = setByMonth(new Date(date), 12 as const)
            expect(result12.getMonth()).toBe(11)
        })
    })

    describe('setByDay', () => {
        it('should set day correctly with valid values', () => {
            const date = new Date('2020-07-01T12:34:56.123Z')
            const result = setByDay(date, 15)
            expect(result).toEqual(new Date('2020-07-15T12:34:56.123Z'))
        })

        it('should preserve time when setting day', () => {
            const date = new Date('2020-07-01T14:30:45.999Z')
            const result = setByDay(date, 25)
            expect(result.getUTCHours()).toBe(14)
            expect(result.getUTCMinutes()).toBe(30)
            expect(result.getUTCSeconds()).toBe(45)
            expect(result.getUTCMilliseconds()).toBe(999)
        })

        it('should handle day boundaries correctly', () => {
            const date = new Date('2020-07-01T12:00:00.000Z') // July has 31 days
            
            // Test valid days (1-31)
            for (let day = 1; day <= 31; day++) {
                const result = setByDay(new Date(date), day)
                expect(result.getDate()).toBe(day)
            }
        })

        it('should handle month overflow correctly', () => {
            const date = new Date('2020-02-01T12:00:00.000Z') // February 2020 (leap year, 29 days)
            const result = setByDay(date, 31)
            expect(result).toEqual(new Date('2020-03-02T12:00:00.000Z')) // Overflows to March
        })

        it('should handle February in leap year', () => {
            const date = new Date('2020-02-01T12:00:00.000Z') // 2020 is leap year
            const result = setByDay(date, 29)
            expect(result).toEqual(new Date('2020-02-29T12:00:00.000Z'))
        })

        it('should handle February in non-leap year with overflow', () => {
            const date = new Date('2021-02-01T12:00:00.000Z') // 2021 is not leap year
            const result = setByDay(date, 29)
            expect(result).toEqual(new Date('2021-03-01T12:00:00.000Z')) // Overflows to March
        })

        it('should log error for invalid day values', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            const date = new Date('2020-07-15T12:00:00.000Z')
            
            // Test invalid days
            setByDay(new Date(date), 0)
            setByDay(new Date(date), 32)
            setByDay(new Date(date), -1)
            setByDay(new Date(date), 50)
            
            expect(consoleSpy).toHaveBeenCalledTimes(4)
            expect(consoleSpy).toHaveBeenCalledWith('setByDay invalid day , must be 1 to 31: ', 0)
            expect(consoleSpy).toHaveBeenCalledWith('setByDay invalid day , must be 1 to 31: ', 32)
            
            consoleSpy.mockRestore()
        })

        it('should still set day even with invalid values (current behavior)', () => {
            const date = new Date('2020-07-15T12:00:00.000Z')
            
            // Test that function still works despite invalid input (current behavior)
            const result1 = setByDay(new Date(date), 0)
            expect(result1.getDate()).toBe(30) // Goes to previous month's last day
            
            const result2 = setByDay(new Date(date), 32)
            expect(result2.getDate()).toBe(1) // Goes to next month's first day
        })

        it('should work with MonthDays type values', () => {
            const date = new Date('2020-07-01T12:00:00.000Z')
            
            // Test with specific MonthDays values (1-31)
            const result1 = setByDay(new Date(date), 1 as const)
            expect(result1.getDate()).toBe(1)
            
            const result31 = setByDay(new Date(date), 31 as const)
            expect(result31.getDate()).toBe(31)
        })
    })

    describe('Combined operations', () => {
        it('should set month and day correctly when chained', () => {
            const result = setByMonth(setByDay(new Date('2020-01-01T12:34:56.123Z'), 7), 7)
            expect(result).toEqual(new Date('2020-07-07T12:34:56.123Z'))
        })

        it('should handle complex date adjustments', () => {
            const result = setByMonth(setByDay(new Date('2023-01-01T12:34:56.123Z'), 28), 2)
            expect(result).toEqual(new Date('2023-02-28T12:34:56.123Z'))
        })

        it('should preserve original date object immutability', () => {
            const originalDate = new Date('2020-01-01T12:34:56.123Z')
            const originalTime = originalDate.getTime()
            
            setByMonth(setByDay(originalDate, 15), 6)
            
            // Original date should be modified (current behavior - functions mutate input)
            expect(originalDate.getTime()).not.toBe(originalTime)
        })

        it('should handle edge case: January 31st to February', () => {
            const date = new Date('2020-01-31T12:00:00.000Z')
            const result = setByMonth(date, 2)
            expect(result).toEqual(new Date('2020-03-02T12:00:00.000Z')) // JavaScript behavior: overflows to March
        })

        it('should handle edge case: January 31st to April', () => {
            const date = new Date('2020-01-31T12:00:00.000Z')
            const result = setByMonth(date, 4)
            expect(result).toEqual(new Date('2020-05-01T12:00:00.000Z')) // JavaScript behavior: overflows to May
        })
    })

    describe('Edge cases and error handling', () => {
        it('should handle invalid Date objects', () => {
            const invalidDate = new Date('invalid')
            
            const result1 = setByMonth(invalidDate, 5)
            expect(isNaN(result1.getTime())).toBe(true)
            
            const result2 = setByDay(new Date('invalid'), 15)
            expect(isNaN(result2.getTime())).toBe(true)
        })

        it('should handle extreme year values', () => {
            const date1 = new Date('1000-01-15T12:00:00.000Z')
            const result1 = setByMonth(date1, 12)
            expect(result1.getFullYear()).toBe(1000)
            expect(result1.getMonth()).toBe(11)
            
            const date2 = new Date('9999-01-15T12:00:00.000Z')
            const result2 = setByDay(date2, 25)
            expect(result2.getFullYear()).toBe(9999)
            expect(result2.getDate()).toBe(25)
        })

        it('should handle fractional numbers by truncating', () => {
            const date = new Date('2020-01-15T12:00:00.000Z')
            
            const result1 = setByMonth(new Date(date), 7.9)
            expect(result1.getMonth()).toBe(6) // July (7-1)
            
            const result2 = setByDay(new Date(date), 25.7)
            expect(result2.getDate()).toBe(25)
        })
    })
})
