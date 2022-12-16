import { addDays } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { Frequency, Weekday } from '../src/types'
import { count, dtStart, d } from './constants'

// DTSTART:20221102T133000Z
// RRULE:FREQ=WEEKLY;COUNT=12;INTERVAL=1;WKST=SU;BYDAY=MO,WE,FR

// 1	Wed,	02	Nov	2022	13:30:00
// 2	Fri,	04	Nov	2022	13:30:00
// 3	Mon,	07	Nov	2022	13:30:00
// 4	Wed,	09	Nov	2022	13:30:00
// 5	Fri,	11	Nov	2022	13:30:00
// 6	Mon,	14	Nov	2022	13:30:00
// 7	Wed,	16	Nov	2022	13:30:00
// 8	Fri,	18	Nov	2022	13:30:00
// 9	Mon,	21	Nov	2022	13:30:00
// 10	Wed,	23	Nov	2022	13:30:00
// 11	Fri,	25	Nov	2022	13:30:00
// 12	Mon,	28	Nov	2022	13:30:00

test(`expandRRule Weekly`, async () => {
    const rRuleString = `${dtStart}\nRRULE:FREQ=${Frequency.WEEKLY};INTERVAL=1;COUNT=${count};BYDAY=MO,WE,FR;WKST=SU`

    const rRule = await parseRecurrenceFromString(rRuleString, Weekday.Sunday)
    expect(rRule).not.toBeUndefined()

    if (rRule) {
        expect(rRule.interval).toEqual(1)
        expect(rRule.frequency).toEqual(Frequency.WEEKLY)

        //console.log('rRule', rRule)

        const startPeriod = addDays(rRule.dtStart, 7)
        const endPeriod = addDays(rRule.dtStart, 14)

        //2 weeks after 1 week - 3 events per week result 6 events
        const ex = await expandRRule(rRule, startPeriod, endPeriod)

        expect(ex).not.toBeUndefined()

        const sequenceDays = [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28]
        const result = Array.from(Array(count).keys()).map((x) => {
            return {
                date: new Date(
                    d.year,
                    d.month,
                    sequenceDays[x],
                    d.hour,
                    d.minute,
                    d.second
                ),
                index: x + 1,
            }
        })

        //console.log('ex.events', ex.events)
        //console.log('result', result)

        ex.events.map((x, i) => {
            expect(x.date).toBeInstanceOf(Date)
            expect(x.date).toEqual(result[i + 3].date)
            expect(x.index).toEqual(result[i + 3].index)
        })
    }
})
