import { addDays } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { Frequency, Weekday } from '../src/types'
import { count, dtStart, today, d } from './constants'

test(`expandRRule Weekly`, () => {
    const rRuleString = `${dtStart}\nRRULE:FREQ=${Frequency.WEEKLY};INTERVAL=1;COUNT=${count};BYDAY=MO,WE,FR;WKST=SU`

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
        const sequenceDays = [2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28]
        const result = Array.from(Array(count).keys()).map((x) => {
            return {
                date: new Date(
                    Date.UTC(
                        d.year,
                        d.month,
                        sequenceDays[x],
                        d.hour,
                        d.minute,
                        d.second
                    )
                ),
                index: x + 1,
            }
        })

        console.log('ex.events', ex.events)
        console.log('result', result)

        ex.events.map((x, i) => {
            expect(x.date).toBeInstanceOf(Date)
            expect(x.date).toEqual(result[i + 3].date)
            expect(x.index).toEqual(result[i + 3].index)
        })
    }
})
