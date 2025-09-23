import { describe, it, expect } from 'vitest'
import { addDays, addWeeks } from '../src/dates'
import { expandRRule, expandRRuleFromString } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { count, dtStart, d } from './constants'

//test
describe('expandRruleWeekly', () => {
    it(`expand rRule weekly intervals and ranges `, () => {
        for (let i = 2; i <= 14; i++) {
            const rRule = `DTSTART:20230602T080000Z\nDTEND:20230702T090000Z\nRRULE:
    FREQ=WEEKLY;
    INTERVAL=${i};    
    BYDAY=MO,TH,SU;WKST=SU`

            const r = expandRRuleFromString(
                rRule,
                new Date(`2023-07-06T00:00:45.000Z`),
                addWeeks(new Date(`2023-07-25T00:00:45.000Z`), i + 7)
            )
            const r2 = expandRRuleFromString(
                rRule,
                addWeeks(new Date(`2023-07-25T00:00:45.000Z`), i),
                addWeeks(new Date(`2023-07-25T00:00:45.000Z`), i + i)
            )

            expect(r).not.toBeUndefined()
            expect(r2).not.toBeUndefined()
            if (r) {
                r2.events.map((x) => {
                    const o = r.events.find((y) => y.index === x.index)
                    expect(o?.date).toEqual(x.date)
                })
            }
        }
    })

    it(`expand rRule Weekly from string with range and interval `, () => {
        const rRule = `DTSTART:20230602T080000Z\nDTEND:20230702T090000Z\nRRULE:
    FREQ=WEEKLY;
    INTERVAL=3;
    UNTIL=20241126T080000Z;
    BYDAY=MO,TH,SU;WKST=SU`
        const r = expandRRuleFromString(
            rRule,
            new Date('2023-06-06T00:00:45.000Z'),
            new Date('2023-09-24T13:30:45.000Z')
        )
        const r2 = expandRRuleFromString(
            rRule,
            new Date('2023-07-25T00:00:45.000Z'),
            new Date('2023-09-24T13:30:45.000Z')
        )

        //console.table(r.events)
        //console.table(r2.events)

        expect(r).not.toBeUndefined()
        expect(r2).not.toBeUndefined()
        if (r) {
            expect(r.events.length).toEqual(10)
            expect(r.events[0].date).toEqual(
                new Date('2023-06-08T08:00:00.000Z')
            )
            expect(r.events[1].date).toEqual(
                new Date('2023-06-25T08:00:00.000Z')
            )
            expect(r.events[2].date).toEqual(
                new Date('2023-06-26T08:00:00.000Z')
            )
            expect(r.events[7].date).toEqual(new Date(r2.events[0].date))
            expect(r.events[8].index).toEqual(r2.events[1].index)
        }
    })

    it(`expand rRule first date Weekly from string with range `, () => {
        const rRule = `DTSTART:20230712T080000Z\nDTEND:20230712T090000Z\nRRULE:FREQ=WEEKLY;UNTIL=20241126T080000Z;BYDAY=MO,TH,SU;WKST=SU`
        const r = expandRRuleFromString(
            rRule,
            new Date('2023-07-17T00:00:45.000Z'),
            new Date('2023-07-24T13:30:45.000Z')
        )
        const r2 = expandRRuleFromString(
            rRule,
            new Date('2023-07-16T00:00:45.000Z'),
            new Date('2023-07-31T13:30:45.000Z')
        )

        // console.table(r.events)
        // console.table(r2.events)

        expect(r).not.toBeUndefined()
        expect(r2).not.toBeUndefined()
        if (r) {
            expect(r.events.length).toEqual(4)
            expect(r.events[0].date).toEqual(
                new Date('2023-07-17T08:00:00.000Z')
            )
            expect(r.events[1].date).toEqual(
                new Date('2023-07-20T08:00:00.000Z')
            )
            expect(r.events[2].date).toEqual(
                new Date('2023-07-23T08:00:00.000Z')
            )
            expect(r.events[2].date).toEqual(new Date(r2.events[3].date))
            expect(r.events[2].index).toEqual(r2.events[3].index)
        }
    })

    it(`expand rRule  Weekly from string with interval `, () => {
        const rRule = `DTSTART:20230704T080000Z\nDTEND:20230704T090000Z\nRRULE:FREQ=WEEKLY;UNTIL=20241126T080000Z;BYDAY=MO,TU,WE,FR;INTERVAL=2;WKST=SU`
        const r = expandRRuleFromString(
            rRule,
            new Date('2023-07-06T00:00:45.000Z'),
            new Date('2023-07-24T13:30:45.000Z')
        )

        //console.table(r.events)
        // console.table(r2.events)

        expect(r).not.toBeUndefined()
    })

    it(`expand rRule Weekly from string with range`, () => {
        const rRule = `DTSTART:20221115T080000Z\nDTEND:20221115T090000Z\nRRULE:FREQ=WEEKLY;UNTIL=20221126T080000Z;BYDAY=MO,TH;WKST=SU`
        const r = expandRRuleFromString(
            rRule,
            new Date('2021-10-01T13:30:45.000Z'),
            new Date('2022-12-31T13:30:45.000Z')
        )
        const r2 = expandRRuleFromString(
            rRule,
            new Date('2022-11-21T08:00:01.000Z'),
            new Date('2022-12-31T13:30:45.000Z')
        )

        expect(r).not.toBeUndefined()
        expect(r2).not.toBeUndefined()
        if (r) {
            expect(r.events.length).toEqual(4)
            expect(r2.events.length).toEqual(2)
            expect(r.events[0].index).toEqual(1)
            expect(r.events[0].date).toEqual(
                new Date('2022-11-17T08:00:00.000Z')
            )
            expect(r.events[1].date).toEqual(
                new Date('2022-11-21T08:00:00.000Z')
            )
            expect(r.events[2].date).toEqual(
                new Date('2022-11-24T08:00:00.000Z')
            )
            expect(r.events[2].date).toEqual(new Date(r2.events[0].date))
            expect(r.events[2].index).toEqual(r2.events[0].index)
        }
    })

    it(`expandRRule Weekly`, () => {
        const rRuleString = `${dtStart}\nRRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=${count};BYDAY=MO,WE,FR;WKST=SU`

        const rRule = parseRecurrenceFromString(rRuleString, 'SU')
        expect(rRule).not.toBeUndefined()

        if (rRule) {
            expect(rRule.interval).toEqual(1)
            expect(rRule.frequency).toEqual('WEEKLY')

            const startPeriod = addDays(rRule.dtStart, 7)
            const endPeriod = addDays(rRule.dtStart, 14)

            //2 weeks after 1 week - 3 events per week result 6 events
            const ex = expandRRule(rRule, startPeriod, endPeriod)

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

            ex.events.map((x, i) => {
                expect(x.date).toBeInstanceOf(Date)
                expect(x.date).toEqual(result[i + 3].date)
                expect(x.index).toEqual(result[i + 3].index)
            })
        }
    })
})
