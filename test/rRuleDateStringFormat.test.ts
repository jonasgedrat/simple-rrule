import { fromRruleDateStringToDate, toRRuleDateString } from '../src/dates'

const dateString = '2022-12-15T15:20:30.000Z'

test('rRuleDateStringFormat', () => {
    const originDate = new Date(dateString)

    const formattedDate = toRRuleDateString(originDate)

    expect(formattedDate).toEqual('20221215T152030Z')

    const dateResult = fromRruleDateStringToDate(formattedDate)

    expect(dateResult).toBeInstanceOf(Date)

    expect(dateResult.toISOString()).toEqual(dateString)
    expect(dateResult).toEqual(originDate)
})

test('rRuleDateStringFormat non regular with milliseconds', () => {
    const dateResult = fromRruleDateStringToDate('20221215T152030123Z')

    expect(dateResult).toBeInstanceOf(Date)

    expect(dateResult.toISOString()).toEqual(dateString)
})
