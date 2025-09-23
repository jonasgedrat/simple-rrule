import { describe, it, expect } from 'vitest'
import { addSeconds } from '../../../src/dates'

describe('addSeconds', () => {
    it('adds the given number of seconds', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30))
    })

    it('add fractional number ', () => {
        const result = addSeconds(new Date(2014, 0, 0, 0, 0, 0), 30.5)
        expect(result).toEqual(new Date(2014, 0, 0, 0, 0, 30, 500))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 6, 10, 12, 45, 0)
        addSeconds(date, 15)
        expect(date).toEqual(new Date(2014, 6, 10, 12, 45, 0))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result = addSeconds(new Date(NaN), 30)
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), NaN)
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Negative seconds tests
    it('subtracts seconds correctly', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 30), -15)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 15))
    })

    it('subtracts seconds across minute boundaries', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 10), -20)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 44, 50))
    })

    it('subtracts seconds across hour boundaries', () => {
        const result = addSeconds(new Date(2014, 6, 10, 13, 0, 10), -20)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 59, 50))
    })

    it('subtracts seconds across day boundaries', () => {
        const result = addSeconds(new Date(2014, 6, 11, 0, 0, 10), -20)
        expect(result).toEqual(new Date(2014, 6, 10, 23, 59, 50))
    })

    // Zero seconds test
    it('returns the same time when adding zero seconds', () => {
        const date = new Date(2014, 6, 10, 12, 45, 30, 123)
        const result = addSeconds(date, 0)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addSeconds(new Date(2014, 0, 1, 0, 0, 0), 31536000) // 365 days worth of seconds
        expect(result).toEqual(new Date(2015, 0, 1, 0, 0, 0)) // Should be January 1, 2015
    })

    it('handles very large negative numbers', () => {
        const result = addSeconds(new Date(2015, 0, 1, 0, 0, 0), -31536000) // 365 days worth of seconds
        expect(result).toEqual(new Date(2014, 0, 1, 0, 0, 0)) // Should be January 1, 2014
    })

    // Minute boundary tests
    it('adds seconds crossing minute boundary', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 45), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 46, 15))
    })

    it('adds seconds crossing multiple minutes', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 30), 150) // 2.5 minutes
        expect(result).toEqual(new Date(2014, 6, 10, 12, 48, 0))
    })

    it('adds seconds crossing hour boundary', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 59, 45), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 0, 15))
    })

    it('adds seconds crossing midnight', () => {
        const result = addSeconds(new Date(2014, 6, 10, 23, 59, 45), 30)
        expect(result).toEqual(new Date(2014, 6, 11, 0, 0, 15))
    })

    // Leap year tests
    it('adds seconds correctly across February 29 in leap year', () => {
        const result = addSeconds(new Date(2020, 1, 28, 23, 59, 45), 30) // February 28, 11:59:45 PM + 30 seconds
        expect(result).toEqual(new Date(2020, 1, 29, 0, 0, 15)) // February 29, 12:00:15 AM
    })

    it('adds seconds correctly from February 29 to March 1 in leap year', () => {
        const result = addSeconds(new Date(2020, 1, 29, 23, 59, 45), 30) // February 29, 11:59:45 PM + 30 seconds
        expect(result).toEqual(new Date(2020, 2, 1, 0, 0, 15)) // March 1, 12:00:15 AM
    })

    // Milliseconds precision tests
    it('preserves milliseconds when adding seconds', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 15, 123), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 45, 123))
    })

    it('preserves milliseconds when subtracting seconds', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 45, 123), -15)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 123))
    })

    // Edge case: exactly 60 seconds
    it('adds exactly 60 seconds (1 minute)', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 30), 60)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 46, 30))
    })

    it('subtracts exactly 60 seconds (1 minute)', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 46, 30), -60)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30))
    })

    // Edge case: exactly 3600 seconds
    it('adds exactly 3600 seconds (1 hour)', () => {
        const result = addSeconds(new Date(2014, 6, 10, 12, 45, 30), 3600)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 45, 30))
    })

    it('subtracts exactly 3600 seconds (1 hour)', () => {
        const result = addSeconds(new Date(2014, 6, 10, 13, 45, 30), -3600)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30))
    })

    // Month boundary tests
    it('adds seconds across month boundaries', () => {
        const result = addSeconds(new Date(2014, 6, 31, 23, 59, 45), 30) // July 31, 11:59:45 PM + 30 seconds
        expect(result).toEqual(new Date(2014, 7, 1, 0, 0, 15)) // August 1, 12:00:15 AM
    })

    it('subtracts seconds across month boundaries', () => {
        const result = addSeconds(new Date(2014, 7, 1, 0, 0, 15), -30) // August 1, 12:00:15 AM - 30 seconds
        expect(result).toEqual(new Date(2014, 6, 31, 23, 59, 45)) // July 31, 11:59:45 PM
    })
})
