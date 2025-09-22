import { describe, it, expect } from 'vitest'
import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addYears,
} from '../../src/dates'

const _d = new Date('2020-01-01T00:00:00.000Z')

describe('addDatesHelpers', () => {
    it('addDays', () => {
        expect(addDays(_d, 7)).toEqual(new Date('2020-01-08T00:00:00.000Z'))
    })
    it('addHours', () => {
        expect(addHours(_d, 7)).toEqual(new Date('2020-01-01T07:00:00.000Z'))
    })
    it('addMinutes', () => {
        expect(addMinutes(_d, 7)).toEqual(new Date('2020-01-01T00:07:00.000Z'))
    })
    it('addMonths', () => {
        expect(addMonths(_d, 7)).toEqual(new Date('2020-08-01T00:00:00.000Z'))
    })
    it('addSeconds', () => {
        expect(addSeconds(_d, 7)).toEqual(new Date('2020-01-01T00:00:07.000Z'))
    })
    it('addYears', () => {
        expect(addYears(_d, 7)).toEqual(new Date('2027-01-01T00:00:00.000Z'))
    })
})
