import { describe, it, expect } from 'vitest'
import { addHours } from '../../../src/dates'

describe('addHours', () => {
    it('adds the given numbers of hours', () => {
        const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
        expect(result).toEqual(new Date(2014, 6, 11, 1, 0))
    })

    it('add fractional number', () => {
        const result = addHours(new Date(2014, 0, 0, 0, 0), 2.5)
        expect(result).toEqual(new Date(2014, 0, 0, 2, 30))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 6, 10, 23, 0)
        addHours(date, 10)
        expect(date).toEqual(new Date(2014, 6, 10, 23, 0))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result: any = addHours(new Date(NaN), 2)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result: any = addHours(new Date(2014, 6, 10, 23, 0), NaN)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Negative hours tests
    it('subtracts hours correctly', () => {
        const result = addHours(new Date(2014, 6, 11, 5, 0), -3)
        expect(result).toEqual(new Date(2014, 6, 11, 2, 0))
    })

    it('subtracts hours across day boundaries', () => {
        const result = addHours(new Date(2014, 6, 11, 2, 0), -5)
        expect(result).toEqual(new Date(2014, 6, 10, 21, 0))
    })

    it('subtracts hours across month boundaries', () => {
        const result = addHours(new Date(2014, 7, 1, 2, 0), -5) // August 1, 2:00 AM - 5 hours
        expect(result).toEqual(new Date(2014, 6, 31, 21, 0)) // July 31, 9:00 PM
    })

    it('subtracts hours across year boundaries', () => {
        const result = addHours(new Date(2015, 0, 1, 2, 0), -5) // January 1, 2015, 2:00 AM - 5 hours
        expect(result).toEqual(new Date(2014, 11, 31, 21, 0)) // December 31, 2014, 9:00 PM
    })

    // Zero hours test
    it('returns the same time when adding zero hours', () => {
        const date = new Date(2014, 6, 10, 15, 30, 45)
        const result = addHours(date, 0)
        expect(result).toEqual(new Date(2014, 6, 10, 15, 30, 45))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addHours(new Date(2014, 0, 1, 0, 0), 8760) // 365 days worth of hours
        expect(result).toEqual(new Date(2015, 0, 1, 0, 0)) // Should be January 1, 2015
    })

    it('handles very large negative numbers', () => {
        const result = addHours(new Date(2015, 0, 1, 0, 0), -8760) // 365 days worth of hours
        expect(result).toEqual(new Date(2014, 0, 1, 0, 0)) // Should be January 1, 2014
    })

    // Day boundary tests
    it('adds hours crossing midnight', () => {
        const result = addHours(new Date(2014, 6, 10, 22, 0), 4)
        expect(result).toEqual(new Date(2014, 6, 11, 2, 0))
    })

    it('adds hours crossing multiple days', () => {
        const result = addHours(new Date(2014, 6, 10, 12, 0), 36) // 1.5 days
        expect(result).toEqual(new Date(2014, 6, 12, 0, 0))
    })

    // Leap year tests
    it('adds hours correctly across February 29 in leap year', () => {
        const result = addHours(new Date(2020, 1, 28, 20, 0), 8) // February 28, 8:00 PM + 8 hours
        expect(result).toEqual(new Date(2020, 1, 29, 4, 0)) // February 29, 4:00 AM
    })

    it('adds hours correctly from February 29 to March 1 in leap year', () => {
        const result = addHours(new Date(2020, 1, 29, 20, 0), 8) // February 29, 8:00 PM + 8 hours
        expect(result).toEqual(new Date(2020, 2, 1, 4, 0)) // March 1, 4:00 AM
    })

    // Time precision tests
    it('preserves minutes, seconds, and milliseconds when adding hours', () => {
        const result = addHours(new Date(2014, 6, 10, 10, 30, 45, 123), 5)
        expect(result).toEqual(new Date(2014, 6, 10, 15, 30, 45, 123))
    })

    it('preserves minutes, seconds, and milliseconds when subtracting hours', () => {
        const result = addHours(new Date(2014, 6, 10, 15, 30, 45, 123), -3)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 30, 45, 123))
    })
})
