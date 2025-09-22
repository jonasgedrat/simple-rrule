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
} from '../../src/dates'

const _d = new Date('2020-01-01T00:00:00.000Z')

describe('differenceHelpers', () => {
    it('differenceInDays', () => {
        expect(differenceInDays(addDays(_d, 7), _d)).toEqual(7)
    })

    it('differenceInHours', () => {
        expect(differenceInHours(addHours(_d, 7), _d)).toEqual(7)
    })

    it('differenceInMinutes', () => {
        expect(differenceInMinutes(addMinutes(_d, 7), _d)).toEqual(7)
    })

    it('differenceInMonths', () => {
        expect(differenceInMonths(addMonths(_d, 7), _d)).toEqual(7)
    })

    it('differenceInSeconds', () => {
        expect(differenceInSeconds(addSeconds(_d, 7), _d)).toEqual(7)
    })

    it('differenceInWeeks', () => {
        expect(differenceInWeeks(addWeeks(_d, 7), _d)).toEqual(7)
    })

    it('differenceInYears', () => {
        expect(differenceInYears(addYears(_d, 7), _d)).toEqual(7)
    })
})
