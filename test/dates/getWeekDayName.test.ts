import { describe, it, expect } from 'vitest'
import { getWeekDayName } from '../../src/dates'

describe('getWeekDayName', () => {
    it('should return correct weekday abbreviations', () => {
        expect(getWeekDayName(new Date('2020-01-05T15:20:30.000Z'))).toEqual(
            'SU'
        )
        expect(getWeekDayName(new Date('2020-01-06T15:20:30.000Z'))).toEqual(
            'MO'
        )
        expect(getWeekDayName(new Date('2020-01-07T15:20:30.000Z'))).toEqual(
            'TU'
        )
        expect(getWeekDayName(new Date('2020-01-08T15:20:30.000Z'))).toEqual(
            'WE'
        )
        expect(getWeekDayName(new Date('2020-01-09T15:20:30.000Z'))).toEqual(
            'TH'
        )
        expect(getWeekDayName(new Date('2020-01-10T15:20:30.000Z'))).toEqual(
            'FR'
        )
        expect(getWeekDayName(new Date('2020-01-11T15:20:30.000Z'))).toEqual(
            'SA'
        )
    })
})
