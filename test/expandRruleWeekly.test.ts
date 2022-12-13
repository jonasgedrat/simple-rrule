import { addDays } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { Frequency, Weekday } from '../src/types'

const today = new Date('2022-12-01T03:00:00.000Z')

const dtStart = `DTSTART:${toRRuleDateString(today)}`

test(`expandRRule Weekly`, () => {
    const rRuleString = `${dtStart}\nRRULE:FREQ=${Frequency.WEEKLY};INTERVAL=1;COUNT=15;BYDAY=MO,WE,FR;WKST=SU`

    const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
    expect(rRule).not.toBeUndefined()

    if (rRule) {
        expect(rRule.interval).toEqual(1)
        expect(rRule.frequency).toEqual(Frequency.WEEKLY)

        const startPeriod = addDays(today, 7)
        const endPeriod = addDays(startPeriod, 14)

        //2 weeks after 1 week - 3 events per week result 6 events
        const ex = expandRRule(rRule, startPeriod, endPeriod)

        expect(ex).not.toBeUndefined()
        // 1	Fri,	02	Dec	2022	00:00:00	GMT
        // 2	Mon,	05	Dec	2022	00:00:00	GMT
        // 3	Wed,	07	Dec	2022	00:00:00	GMT
        // 4	Fri,	09	Dec	2022	00:00:00	GMT
        // 5	Mon,	12	Dec	2022	00:00:00	GMT
        // 6	Wed,	14	Dec	2022	00:00:00	GMT
        // 7	Fri,	16	Dec	2022	00:00:00	GMT
        // 8	Mon,	19	Dec	2022	00:00:00	GMT
        // 9	Wed,	21	Dec	2022	00:00:00	GMT
        // 10	Fri,	23	Dec	2022	00:00:00	GMT
        // 11	Mon,	26	Dec	2022	00:00:00	GMT
        // 12	Wed,	28	Dec	2022	00:00:00	GMT
        // 13	Fri,	30	Dec	2022	00:00:00	GMT
        // 14	Mon,	02	Jan	2023	00:00:00	GMT
        // 15	Wed,	04	Jan	2023	00:00:00	GMT

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
        ]

        // const expectedResultRange = [
        //     { date: '2022-12-09T03:00.000Z', index: 4 },
        //     { date: '2022-12-12T03:00.000Z', index: 5 },
        //     { date: '2022-12-14T03:00.000Z', index: 6 },
        //     { date: '2022-12-16T03:00.000Z', index: 7 },
        //     { date: '2022-12-19T03:00.000Z', index: 8 },
        //     { date: '2022-12-21T03:00.000Z', index: 9 },
        // ]

        //console.log(ex.events, result)

        ex.events.map((x, i) => {
            expect(x.date).toBeInstanceOf(Date)
            expect(x.date.toISOString()).toEqual(result[i + 3].date)
            expect(x.index).toEqual(result[i + 3].index)
        })
    }
})
