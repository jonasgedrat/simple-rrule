import { describe, it, expect } from 'vitest'
import { isBefore } from '../../src/dates'

describe('isBefore', () => {
    it('should return true when first date is before second date', () => {
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2021-01-08T00:00:00.000Z')
            )
        ).toEqual(true)

        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-02-08T00:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-09T00:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T01:00:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:02:00.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:03.000Z')
            )
        ).toEqual(true)
        expect(
            isBefore(
                new Date('2020-01-08T00:00:00.000Z'),
                new Date('2020-01-08T00:00:00.004Z')
            )
        ).toEqual(true)
    })
})
