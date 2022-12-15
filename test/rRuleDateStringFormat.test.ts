import { fromRruleDateStringToDate } from './../src/rRuleDateStringFormat'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'

test('rRuleDateStringFormat', () => {
    const dateString = '2022-12-15T15:20:30.000Z'

    const formattedDate = toRRuleDateString(new Date(dateString))

    expect(formattedDate).toEqual('20221215T152030Z')

    const dateResult = fromRruleDateStringToDate(formattedDate)

    expect(dateResult).toBeInstanceOf(Date)

    expect(dateResult.toISOString()).toEqual(dateString)
})
