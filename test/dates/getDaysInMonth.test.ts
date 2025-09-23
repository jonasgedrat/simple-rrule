import { describe, it, expect } from 'vitest'
import { getDaysInMonth } from '../../src/dates'

describe('getDaysInMonth', () => {
    describe('Months with 31 days', () => {
        it('January should have 31 days', () => {
            const date = new Date(2023, 0, 1) // January 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('March should have 31 days', () => {
            const date = new Date(2023, 2, 1) // March 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('May should have 31 days', () => {
            const date = new Date(2023, 4, 1) // May 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('July should have 31 days', () => {
            const date = new Date(2023, 6, 1) // July 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('August should have 31 days', () => {
            const date = new Date(2023, 7, 1) // August 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('October should have 31 days', () => {
            const date = new Date(2023, 9, 1) // October 2023
            expect(getDaysInMonth(date)).toBe(31)
        })

        it('December should have 31 days', () => {
            const date = new Date(2023, 11, 1) // December 2023
            expect(getDaysInMonth(date)).toBe(31)
        })
    })

    describe('Months with 30 days', () => {
        it('April should have 30 days', () => {
            const date = new Date(2023, 3, 1) // April 2023
            expect(getDaysInMonth(date)).toBe(30)
        })

        it('June should have 30 days', () => {
            const date = new Date(2023, 5, 1) // June 2023
            expect(getDaysInMonth(date)).toBe(30)
        })

        it('September should have 30 days', () => {
            const date = new Date(2023, 8, 1) // September 2023
            expect(getDaysInMonth(date)).toBe(30)
        })

        it('November should have 30 days', () => {
            const date = new Date(2023, 10, 1) // November 2023
            expect(getDaysInMonth(date)).toBe(30)
        })
    })

    describe('February in non-leap years', () => {
        it('February 2023 should have 28 days', () => {
            const date = new Date(2023, 1, 1) // February 2023
            expect(getDaysInMonth(date)).toBe(28)
        })

        it('February 2021 should have 28 days', () => {
            const date = new Date(2021, 1, 1) // February 2021
            expect(getDaysInMonth(date)).toBe(28)
        })

        it('February 2019 should have 28 days', () => {
            const date = new Date(2019, 1, 1) // February 2019
            expect(getDaysInMonth(date)).toBe(28)
        })
    })

    describe('February in leap years', () => {
        it('February 2024 should have 29 days (leap year)', () => {
            const date = new Date(2024, 1, 1) // February 2024
            expect(getDaysInMonth(date)).toBe(29)
        })

        it('February 2020 should have 29 days (leap year)', () => {
            const date = new Date(2020, 1, 1) // February 2020
            expect(getDaysInMonth(date)).toBe(29)
        })

        it('February 2016 should have 29 days (leap year)', () => {
            const date = new Date(2016, 1, 1) // February 2016
            expect(getDaysInMonth(date)).toBe(29)
        })

        it('February 2000 should have 29 days (leap year - divisible by 400)', () => {
            const date = new Date(2000, 1, 1) // February 2000
            expect(getDaysInMonth(date)).toBe(29)
        })
    })

    describe('Special leap year cases', () => {
        it('February 1900 should have 28 days (not leap year - divisible by 100 but not by 400)', () => {
            const date = new Date(1900, 1, 1) // February 1900
            expect(getDaysInMonth(date)).toBe(28)
        })

        it('February 2100 should have 28 days (not leap year - divisible by 100 but not by 400)', () => {
            const date = new Date(2100, 1, 1) // February 2100
            expect(getDaysInMonth(date)).toBe(28)
        })

        it('February 1600 should have 29 days (leap year - divisible by 400)', () => {
            const date = new Date(1600, 1, 1) // February 1600
            expect(getDaysInMonth(date)).toBe(29)
        })
    })

    describe('Tests with different days of the month', () => {
        it('Should return the same result regardless of the day of the month', () => {
            const date1 = new Date(2023, 0, 1) // January 1st
            const date2 = new Date(2023, 0, 15) // January 15th
            const date3 = new Date(2023, 0, 31) // January 31st

            expect(getDaysInMonth(date1)).toBe(31)
            expect(getDaysInMonth(date2)).toBe(31)
            expect(getDaysInMonth(date3)).toBe(31)
        })

        it('Should return the same result for February regardless of the day', () => {
            const date1 = new Date(2024, 1, 1) // February 1st 2024
            const date2 = new Date(2024, 1, 15) // February 15th 2024
            const date3 = new Date(2024, 1, 29) // February 29th 2024

            expect(getDaysInMonth(date1)).toBe(29)
            expect(getDaysInMonth(date2)).toBe(29)
            expect(getDaysInMonth(date3)).toBe(29)
        })
    })

    describe('Tests with negative and very old years', () => {
        it('Should work with negative years', () => {
            const date = new Date(-1, 1, 1) // February of year -1
            expect(getDaysInMonth(date)).toBe(28)
        })

        it('Should work with very old years', () => {
            const date = new Date(100, 1, 1) // February of year 100
            expect(getDaysInMonth(date)).toBe(28)
        })
    })
})
