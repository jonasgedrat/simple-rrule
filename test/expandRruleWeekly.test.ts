import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { Frequency, Weekday } from '../src/types'

const today = new Date('2022-12-01T03:00:00.000Z')

const dtStart = `DTSTART:${toRRuleDateString(today)}`

test(`expandRRule Weekly`, () => {
    const rRuleString = `${dtStart}\nRRULE:FREQ=${Frequency.WEEKLY};INTERVAL=1;COUNT=30;BYDAY=MO,WE,FR;WKST=SU`

    const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
    expect(rRule).not.toBeUndefined()

    if (rRule) {
        expect(rRule.interval).toEqual(1)
        expect(rRule.frequency).toEqual(Frequency.WEEKLY)

        const startPeriod = new Date('2022-12-08T03:00:00.000Z')
        const endPeriod = new Date('2022-12-22T03:00:00.000Z')

        //2 weeks after 1 week - 3 events per week result 6 events
        const ex = expandRRule(rRule, startPeriod, endPeriod)

        expect(ex).not.toBeUndefined()

        const result = [
            { date: '2022-12-02T03:00:00.000Z', index: 1 },
            { date: '2022-12-05T03:00:00.000Z', index: 2 },
            { date: '2022-12-07T03:00:00.000Z', index: 3 },
            { date: '2022-12-09T03:00:00.000Z', index: 4 },
            { date: '2022-12-12T03:00:00.000Z', index: 5 },
            { date: '2022-12-14T03:00:00.000Z', index: 6 },
            { date: '2022-12-16T03:00:00.000Z', index: 7 },
            { date: '2022-12-19T03:00:00.000Z', index: 8 },
            { date: '2022-12-21T03:00:00.000Z', index: 9 },
            { date: '2022-12-23T03:00:00.000Z', index: 10 },
            { date: '2022-12-26T03:00:00.000Z', index: 11 },
            { date: '2022-12-28T03:00:00.000Z', index: 12 },
            { date: '2022-12-30T03:00:00.000Z', index: 13 },
            { date: '2023-01-02T03:00:00.000Z', index: 14 },
            { date: '2023-01-04T03:00:00.000Z', index: 15 },
            { date: '2023-01-06T03:00:00.000Z', index: 16 },
            { date: '2023-01-09T03:00:00.000Z', index: 17 },
            { date: '2023-01-11T03:00:00.000Z', index: 18 },
            { date: '2023-01-13T03:00:00.000Z', index: 19 },
            { date: '2023-01-16T03:00:00.000Z', index: 20 },
            { date: '2023-01-18T03:00:00.000Z', index: 21 },
            { date: '2023-01-20T03:00:00.000Z', index: 22 },
            { date: '2023-01-23T03:00:00.000Z', index: 23 },
            { date: '2023-01-25T03:00:00.000Z', index: 24 },
            { date: '2023-01-27T03:00:00.000Z', index: 25 },
            { date: '2023-01-30T03:00:00.000Z', index: 26 },
            { date: '2023-02-01T03:00:00.000Z', index: 27 },
            { date: '2023-02-03T03:00:00.000Z', index: 28 },
            { date: '2023-02-06T03:00:00.000Z', index: 29 },
            { date: '2023-02-08T03:00:00.000Z', index: 30 },
        ]

        // const resultRange = [
        //     { date: '2022-12-09T03:00:00.000Z', index: 4 },
        //     { date: '2022-12-12T03:00:00.000Z', index: 5 },
        //     { date: '2022-12-14T03:00:00.000Z', index: 6 },
        //     { date: '2022-12-16T03:00:00.000Z', index: 7 },
        //     { date: '2022-12-19T03:00:00.000Z', index: 8 },
        //     { date: '2022-12-21T03:00:00.000Z', index: 9 },
        // ]

        //console.log(ex.events)
        ex.events.map((x, i) => {
            expect(`${new Date(x.date).toISOString()}`).toEqual(
                result[i + 3].date
            )
            expect(x.index).toEqual(result[i + 3].index)
        })
    }
})
