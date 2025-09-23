import { describe, it, expect } from 'vitest'
import { addMinutes } from '../../../src/dates'

describe('addMinutes', () => {
    it('adds the given number of minutes', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 30))
    })

    it('add fractional number', () => {
        const result = addMinutes(new Date(2014, 0, 0, 0, 0), 30.5)
        expect(result).toEqual(new Date(2014, 0, 0, 0, 30, 30))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 6, 10, 12, 0)
        addMinutes(date, 25)
        expect(date).toEqual(new Date(2014, 6, 10, 12, 0))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result: any = addMinutes(new Date(NaN), 30)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result: any = addMinutes(new Date(2014, 6, 10, 12, 0), NaN)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Negative minutes tests
    it('subtracts minutes correctly', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 30), -15)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 15))
    })

    it('subtracts minutes across hour boundaries', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 10), -20)
        expect(result).toEqual(new Date(2014, 6, 10, 11, 50))
    })

    it('subtracts minutes across day boundaries', () => {
        const result = addMinutes(new Date(2014, 6, 11, 0, 10), -20)
        expect(result).toEqual(new Date(2014, 6, 10, 23, 50))
    })

    it('subtracts minutes across month boundaries', () => {
        const result = addMinutes(new Date(2014, 7, 1, 0, 10), -20) // August 1, 00:10 - 20 minutes
        expect(result).toEqual(new Date(2014, 6, 31, 23, 50)) // July 31, 23:50
    })

    // Zero minutes test
    it('returns the same time when adding zero minutes', () => {
        const date = new Date(2014, 6, 10, 12, 30, 45, 123)
        const result = addMinutes(date, 0)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 30, 45, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addMinutes(new Date(2014, 0, 1, 0, 0), 525600) // 365 days worth of minutes
        expect(result).toEqual(new Date(2015, 0, 1, 0, 0)) // Should be January 1, 2015
    })

    it('handles very large negative numbers', () => {
        const result = addMinutes(new Date(2015, 0, 1, 0, 0), -525600) // 365 days worth of minutes
        expect(result).toEqual(new Date(2014, 0, 1, 0, 0)) // Should be January 1, 2014
    })

    // Hour boundary tests
    it('adds minutes crossing hour boundary', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 45), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 15))
    })

    it('adds minutes crossing multiple hours', () => {
        const result = addMinutes(new Date(2014, 6, 10, 10, 30), 150) // 2.5 hours
        expect(result).toEqual(new Date(2014, 6, 10, 13, 0))
    })

    it('adds minutes crossing midnight', () => {
        const result = addMinutes(new Date(2014, 6, 10, 23, 45), 30)
        expect(result).toEqual(new Date(2014, 6, 11, 0, 15))
    })

    // Leap year tests
    it('adds minutes correctly across February 29 in leap year', () => {
        const result = addMinutes(new Date(2020, 1, 28, 23, 45), 30) // February 28, 11:45 PM + 30 minutes
        expect(result).toEqual(new Date(2020, 1, 29, 0, 15)) // February 29, 12:15 AM
    })

    it('adds minutes correctly from February 29 to March 1 in leap year', () => {
        const result = addMinutes(new Date(2020, 1, 29, 23, 45), 30) // February 29, 11:45 PM + 30 minutes
        expect(result).toEqual(new Date(2020, 2, 1, 0, 15)) // March 1, 12:15 AM
    })

    // Time precision tests
    it('preserves seconds and milliseconds when adding minutes', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 15, 30, 123), 45)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 0, 30, 123))
    })

    it('preserves seconds and milliseconds when subtracting minutes', () => {
        const result = addMinutes(new Date(2014, 6, 10, 13, 0, 30, 123), -15)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 123))
    })

    // Edge case: exactly 60 minutes
    it('adds exactly 60 minutes (1 hour)', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 30), 60)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 30))
    })

    it('subtracts exactly 60 minutes (1 hour)', () => {
        const result = addMinutes(new Date(2014, 6, 10, 13, 30), -60)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 30))
    })
})
