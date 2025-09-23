import { describe, it, expect } from 'vitest'
import { addMilliseconds } from '../../../src/dates'

describe('addMilliseconds', () => {
    it('adds the given number of milliseconds', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 750))
    })

    it('adds fractional milliseconds (rounds down)', () => {
        const result = addMilliseconds(new Date(2014, 0, 0, 0, 0, 0, 0), 123.7)
        expect(result).toEqual(new Date(2014, 0, 0, 0, 0, 0, 123))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 6, 10, 12, 45, 30, 500)
        addMilliseconds(date, 250)
        expect(date).toEqual(new Date(2014, 6, 10, 12, 45, 30, 500))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result = addMilliseconds(new Date(NaN), 1000)
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), NaN)
        expect(isNaN(result as any)).toBeTruthy()
    })

    // Negative milliseconds tests
    it('subtracts milliseconds correctly', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 750), -250)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 500))
    })

    it('subtracts milliseconds across second boundaries', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 200), -500)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 29, 700))
    })

    it('subtracts milliseconds across minute boundaries', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 0, 200), -500)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 44, 59, 700))
    })

    it('subtracts milliseconds across hour boundaries', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 13, 0, 0, 200), -500)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 59, 59, 700))
    })

    it('subtracts milliseconds across day boundaries', () => {
        const result = addMilliseconds(new Date(2014, 6, 11, 0, 0, 0, 200), -500)
        expect(result).toEqual(new Date(2014, 6, 10, 23, 59, 59, 700))
    })

    // Zero milliseconds test
    it('returns the same time when adding zero milliseconds', () => {
        const date = new Date(2014, 6, 10, 12, 45, 30, 123)
        const result = addMilliseconds(date, 0)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 123))
        expect(result).not.toBe(date) // Should not be the same object
    })

    // Large numbers tests
    it('handles very large positive numbers', () => {
        const result = addMilliseconds(new Date(2014, 0, 1, 0, 0, 0, 0), 86400000) // 1 day worth of milliseconds
        expect(result).toEqual(new Date(2014, 0, 2, 0, 0, 0, 0)) // Should be January 2, 2014
    })

    it('handles very large negative numbers', () => {
        const result = addMilliseconds(new Date(2014, 0, 2, 0, 0, 0, 0), -86400000) // 1 day worth of milliseconds
        expect(result).toEqual(new Date(2014, 0, 1, 0, 0, 0, 0)) // Should be January 1, 2014
    })

    it('handles extremely large positive numbers', () => {
        const result = addMilliseconds(new Date(2014, 0, 1, 0, 0, 0, 0), 31536000000) // 365 days worth of milliseconds
        expect(result).toEqual(new Date(2015, 0, 1, 0, 0, 0, 0)) // Should be January 1, 2015
    })

    it('handles extremely large negative numbers', () => {
        const result = addMilliseconds(new Date(2015, 0, 1, 0, 0, 0, 0), -31536000000) // 365 days worth of milliseconds
        expect(result).toEqual(new Date(2014, 0, 1, 0, 0, 0, 0)) // Should be January 1, 2014
    })

    // Second boundary tests
    it('adds milliseconds crossing second boundary', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 800), 400)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 31, 200))
    })

    it('adds milliseconds crossing multiple seconds', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 500), 2750) // 2.75 seconds
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 33, 250))
    })

    it('adds milliseconds crossing minute boundary', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 59, 800), 400)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 46, 0, 200))
    })

    it('adds milliseconds crossing hour boundary', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 59, 59, 800), 400)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 0, 0, 200))
    })

    it('adds milliseconds crossing midnight', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 23, 59, 59, 800), 400)
        expect(result).toEqual(new Date(2014, 6, 11, 0, 0, 0, 200))
    })

    // Month boundary tests
    it('adds milliseconds crossing month boundaries', () => {
        const result = addMilliseconds(new Date(2014, 6, 31, 23, 59, 59, 800), 400) // July 31, 11:59:59.800 PM + 400ms
        expect(result).toEqual(new Date(2014, 7, 1, 0, 0, 0, 200)) // August 1, 12:00:00.200 AM
    })

    it('subtracts milliseconds across month boundaries', () => {
        const result = addMilliseconds(new Date(2014, 7, 1, 0, 0, 0, 200), -400) // August 1, 12:00:00.200 AM - 400ms
        expect(result).toEqual(new Date(2014, 6, 31, 23, 59, 59, 800)) // July 31, 11:59:59.800 PM
    })

    // Leap year tests
    it('adds milliseconds correctly across February 29 in leap year', () => {
        const result = addMilliseconds(new Date(2020, 1, 28, 23, 59, 59, 800), 400) // February 28, 11:59:59.800 PM + 400ms
        expect(result).toEqual(new Date(2020, 1, 29, 0, 0, 0, 200)) // February 29, 12:00:00.200 AM
    })

    it('adds milliseconds correctly from February 29 to March 1 in leap year', () => {
        const result = addMilliseconds(new Date(2020, 1, 29, 23, 59, 59, 800), 400) // February 29, 11:59:59.800 PM + 400ms
        expect(result).toEqual(new Date(2020, 2, 1, 0, 0, 0, 200)) // March 1, 12:00:00.200 AM
    })

    // Edge cases
    it('adds exactly 1000 milliseconds (1 second)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 500), 1000)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 31, 500))
    })

    it('subtracts exactly 1000 milliseconds (1 second)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 31, 500), -1000)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 500))
    })

    it('adds exactly 60000 milliseconds (1 minute)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 500), 60000)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 46, 30, 500))
    })

    it('subtracts exactly 60000 milliseconds (1 minute)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 46, 30, 500), -60000)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 500))
    })

    it('adds exactly 3600000 milliseconds (1 hour)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 500), 3600000)
        expect(result).toEqual(new Date(2014, 6, 10, 13, 45, 30, 500))
    })

    it('subtracts exactly 3600000 milliseconds (1 hour)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 13, 45, 30, 500), -3600000)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 500))
    })

    // Precision tests
    it('handles maximum millisecond precision (999)', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 999)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 999))
    })

    it('handles rollover from maximum milliseconds', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 999), 1)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 31, 0))
    })

    it('handles rollover to maximum milliseconds', () => {
        const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 31, 0), -1)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 45, 30, 999))
    })

    // Year boundary tests
    it('adds milliseconds crossing year boundaries', () => {
        const result = addMilliseconds(new Date(2014, 11, 31, 23, 59, 59, 800), 400) // December 31, 11:59:59.800 PM + 400ms
        expect(result).toEqual(new Date(2015, 0, 1, 0, 0, 0, 200)) // January 1, 12:00:00.200 AM
    })

    it('subtracts milliseconds across year boundaries', () => {
        const result = addMilliseconds(new Date(2015, 0, 1, 0, 0, 0, 200), -400) // January 1, 12:00:00.200 AM - 400ms
        expect(result).toEqual(new Date(2014, 11, 31, 23, 59, 59, 800)) // December 31, 11:59:59.800 PM
    })
})