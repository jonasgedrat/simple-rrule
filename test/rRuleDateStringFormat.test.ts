import { describe, it, expect } from 'vitest'
import { fromRruleDateStringToDate, toRRuleDateString } from '../src/dates'

const dateString = '2022-12-15T15:20:30.000Z'

describe('rRuleDateStringFormat', () => {
    it('should format and parse date strings correctly', () => {
        const originDate = new Date(dateString)

        const formattedDate = toRRuleDateString(originDate)

        expect(formattedDate).toEqual('20221215T152030Z')

        const dateResult = fromRruleDateStringToDate(formattedDate)

        expect(dateResult).toBeInstanceOf(Date)

        expect(dateResult.toISOString()).toEqual(dateString)
        expect(dateResult).toEqual(originDate)
    })

    it('should handle non regular format with milliseconds', () => {
        const dateResult = fromRruleDateStringToDate('20221215T152030123Z')

        expect(dateResult).toBeInstanceOf(Date)

        expect(dateResult.toISOString()).toEqual(dateString)
    })
})
