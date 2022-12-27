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
test(`expand rRule MonthDay with range `, () => {
    const rRule = `DTSTART:${toRRuleDateString(
        today
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;COUNT=3;WKST=SU`

    const r = expandRRuleFromString(
        rRule,
        addMonths(today, 2),
        addMonths(today, 4)
    )
    expect(r).not.toBeUndefined()

    if (r) {
        expect(r.events.length).toEqual(1)
        expect(r.events[0].index).toEqual(3)
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
        new Date('2022-12-31T10:00:00.000Z'),
        new Date('2023-05-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(5)
        expect(r.events[2].date.getDate()).toEqual(3) //february with 28 days
        expect(r.events[3].date.getDate()).toEqual(31) //march ok
        expect(r.events[4].date.getDate()).toEqual(1) //april with 30 days
    }
})

test(`expand rRule Month bySetPos with count range`, () => {
    const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;COUNT=6;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2023-03-09T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(4)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-04-12T10:00:00.000Z'
        )
        expect(r.events[0].index).toEqual(3)

        expect(r.events[1].date.toISOString()).toEqual(
            '2023-05-10T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2023-06-14T10:00:00.000Z'
        )
    }
})

test(`expand rRule Month bySetPos with until Date with range`, () => {
    const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;UNTIL=20230411T100000Z;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2023-02-02T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(2)

        expect(r.events[0].index).toEqual(2)
        expect(r.events[0].date.toISOString()).toEqual(
            '2023-02-08T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2023-03-08T10:00:00.000Z'
        )
    }
})

test(`expand rRule Month bySetPos with count`, () => {
    const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;COUNT=6;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-12-15T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(6)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-01-11T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2023-02-08T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2023-03-08T10:00:00.000Z'
        )
        expect(r.events[3].date.toISOString()).toEqual(
            '2023-04-12T10:00:00.000Z'
        )
        expect(r.events[4].date.toISOString()).toEqual(
            '2023-05-10T10:00:00.000Z'
        )
        expect(r.events[5].date.toISOString()).toEqual(
            '2023-06-14T10:00:00.000Z'
        )
    }
})

test(`expand rRule Month bySetPos with until Date`, () => {
    const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;UNTIL=20230411T100000Z;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-12-15T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(3)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-01-11T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2023-02-08T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2023-03-08T10:00:00.000Z'
        )
    }
})
