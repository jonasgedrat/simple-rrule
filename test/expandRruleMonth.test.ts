import { addMonths, toRRuleDateString } from '../src/dates'
import { expandRRuleFromString } from '../src/expandRrule'
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
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;COUNT=6;WKST=SU`

    const r = expandRRuleFromString(
        rRule,
        addMonths(today, 2),
        addMonths(today, 4)
    )
    const r2 = expandRRuleFromString(
        rRule,
        addMonths(today, 3),
        addMonths(today, 4)
    )

    expect(r).not.toBeUndefined()

    if (r) {
        expect(r.events.length).toEqual(2)
        expect(r.events[0].index).toEqual(3)
        expect(r.events[0].date.getDate()).toEqual(15)
        expect(r2.events[0].date.getDate()).toEqual(15)

        const index = 4
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
    }
})

test(`expand rRule Month with range`, () => {
    const rRule = `DTSTART:${toRRuleDateString(
        today
    )}\nRRULE:FREQ=MONTHLY;INTERVAL=1;COUNT=6;WKST=SU`

    const r = expandRRuleFromString(
        rRule,
        addMonths(today, 2),
        addMonths(today, 7)
    )
    const r2 = expandRRuleFromString(
        rRule,
        addMonths(today, 3),
        addMonths(today, 7)
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(4)
        expect(r.events[0].index).toEqual(3)

        const index = 5
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
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

    //   { date: 2022-12-31T10:00:00.000Z, index: 1 },
    //   { date: 2023-01-31T10:00:00.000Z, index: 2 },
    //   { date: 2023-02-28T10:00:00.000Z, index: 3 },
    //   { date: 2023-03-31T10:00:00.000Z, index: 4 },
    //   { date: 2023-04-30T10:00:00.000Z, index: 5 }

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(5)
        expect(r.events[2].date.getDate()).toEqual(28) //february with 28 days
        expect(r.events[3].date.getDate()).toEqual(31) //march ok
        expect(r.events[4].date.getDate()).toEqual(30) //april with 30 days
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
    const r2 = expandRRuleFromString(
        rRule,
        new Date('2023-05-09T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    //all events
    //   2023-01-11T10:00:00.000Z,
    //   2023-02-08T10:00:00.000Z,
    //   2023-03-08T10:00:00.000Z,
    //   2023-04-12T10:00:00.000Z,
    //   2023-05-10T10:00:00.000Z,
    //   2023-06-14T10:00:00.000Z

    //   { date: 2023-04-12T10:00:00.000Z, index: 4 },
    //   { date: 2023-05-10T10:00:00.000Z, index: 5 },
    //   { date: 2023-06-14T10:00:00.000Z, index: 6 }

    expect(r).not.toBeUndefined()
    expect(r2).not.toBeUndefined()

    if (r) {
        expect(r.events.length).toEqual(3)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-04-12T10:00:00.000Z'
        )
        expect(r.events[0].index).toEqual(4)

        expect(r.events[1].date.toISOString()).toEqual(
            '2023-05-10T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2023-06-14T10:00:00.000Z'
        )

        const index = 5
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
    }
})

test(`expand rRule Month bySetPos with until Date with range`, () => {
    const rRule =
        'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;UNTIL=20230611T100000Z;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2023-02-02T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )
    const r2 = expandRRuleFromString(
        rRule,
        new Date('2023-04-02T10:00:00.000Z'),
        new Date('2023-12-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(4)

        expect(r.events[0].index).toEqual(2)
        expect(r.events[0].date.toISOString()).toEqual(
            '2023-02-08T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2023-03-08T10:00:00.000Z'
        )

        const index = 5
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
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
