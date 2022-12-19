import { addMonths } from 'date-fns'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { expandRRuleFromString } from './../src/expandRrule'
import { today } from './constants'

test(`expand rRule Month`, () => {
    const rRule = `DTSTART:${toRRuleDateString(
        today
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;COUNT=3;WKST=SU`

    const r = expandRRuleFromString(rRule, today, addMonths(today, 4))
    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(3)
        expect(r.events[0].index).toEqual(1)
    }
})

test(`expand rRule MonthDay`, () => {
    const rRule = `DTSTART:${toRRuleDateString(
        today
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;COUNT=3;WKST=SU`

    const r = expandRRuleFromString(rRule, today, addMonths(today, 4))
    expect(r).not.toBeUndefined()

    if (r) {
        expect(r.events.length).toEqual(3)
        expect(r.events[0].index).toEqual(1)
        expect(r.events[0].date.getDate()).toEqual(15)
    }
})

test(`expand rRule Month with range`, () => {
    const rRule = `DTSTART:${toRRuleDateString(
        today
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;COUNT=6;WKST=SU`

    const r = expandRRuleFromString(
        rRule,
        addMonths(today, 3),
        addMonths(today, 7)
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(3)
        expect(r.events[0].index).toEqual(4)
    }
})

test(`expand rRule Month monthDay 31`, () => {
    const rRule =
        'DTSTART:20221231T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=31;COUNT=5;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        addMonths(today, 3),
        addMonths(today, 7)
    )
    // console.log(r)
    //   { date: 2023-03-03T00:00:00.000Z, index: 3 },
    //   { date: 2023-03-31T00:00:00.000Z, index: 4 },
    //   { date: 2023-05-01T00:00:00.000Z, index: 5 }

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(3)
        expect(r.events[0].date.getDate()).toEqual(3) //february with 28 days
        expect(r.events[1].date.getDate()).toEqual(31) //march ok
        expect(r.events[2].date.getDate()).toEqual(1) //april with 30 days

        expect(r.events[0].index).toEqual(3)
    }
})
