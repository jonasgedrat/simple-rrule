import { describe, it, expect } from 'vitest'
import { setByDay, setByMonth } from '../../src/dates'

describe('setByMonthByDay', () => {
    it('should set month and day correctly', () => {
        expect(
            setByMonth(setByDay(new Date('2020-01-01T12:34:56.123Z'), 7), 7)
        ).toEqual(new Date('2020-07-07T12:34:56.123Z'))

        expect(
            setByMonth(setByDay(new Date('2023-01-01T12:34:56.123Z'), 28), 2)
        ).toEqual(new Date('2023-02-28T12:34:56.123Z'))
    })
})
