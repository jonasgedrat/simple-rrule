import { expandRRuleFromString } from './../src/expandRrule'

test(`expand rRule Year`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;INTERVAL=1;COUNT=5;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-12-16T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(4)
        expect(r.events[0].date.toISOString()).toEqual(
            '2023-12-15T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2024-12-15T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2025-12-15T10:00:00.000Z'
        )
        expect(r.events[3].date.toISOString()).toEqual(
            '2026-12-15T10:00:00.000Z'
        )
    }
})

test(`expand rRule Year byMonth and byMonthDay`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYMONTHDAY=27;BYMONTH=12;COUNT=5;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-12-16T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(5)

        expect(r.events[0].date.toISOString()).toEqual(
            '2022-12-27T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2023-12-27T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2024-12-27T10:00:00.000Z'
        )
        expect(r.events[3].date.toISOString()).toEqual(
            '2025-12-27T10:00:00.000Z'
        )
        expect(r.events[4].date.toISOString()).toEqual(
            '2026-12-27T10:00:00.000Z'
        )
    }
})

test(`expand rRule Year byMonth and byMonthDay in range`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYMONTHDAY=27;BYMONTH=1;COUNT=6;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2024-01-28T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )
    const r2 = expandRRuleFromString(
        rRule,
        new Date('2025-01-10T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )
    //   2022-01-27T10:00:00.000Z,1
    //   2023-01-27T10:00:00.000Z,2
    //   2024-01-27T10:00:00.000Z,3
    //   2025-01-27T10:00:00.000Z,4
    //   2026-01-27T10:00:00.000Z,5
    //   2027-01-27T10:00:00.000Z,6
    //   2028-01-27T10:00:00.000Z,7
    //   2029-01-27T10:00:00.000Z,8

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(3)
        expect(r.events[0].index).toEqual(4)
        expect(r.events[0].date.getDate()).toEqual(27)
        expect(r2.events[0].date.getDate()).toEqual(27)
        expect(r.events[0].date.getMonth()).toEqual(0)
        expect(r2.events[0].date.getMonth()).toEqual(0)

        expect(r.events[0].date.toISOString()).toEqual(
            '2025-01-27T10:00:00.000Z'
        )
        const index = 5
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
    }
})

test(`expand rRule Year byMonth and byMonthDay  until`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYMONTHDAY=20;BYMONTH=1;UNTIL=20240115T100000Z;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-01-28T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(1)
        expect(r.events[0].index).toEqual(2)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-01-20T10:00:00.000Z'
        )
    }
})

test(`expand rRule Year byMonth bySetPos`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYDAY=MO;BYMONTH=1;BYSETPOS=2;COUNT=5;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2022-01-28T10:00:00.000Z'),
        new Date('2030-05-31T10:00:00.000Z')
    )

    console.log(r)

    //   { date: 2023-01-09T10:00:00.000Z, index: 1 },
    //   { date: 2024-01-08T10:00:00.000Z, index: 2 },
    //   { date: 2025-01-13T10:00:00.000Z, index: 3 },
    //   { date: 2026-01-12T10:00:00.000Z, index: 4 },
    //   { date: 2027-01-11T10:00:00.000Z, index: 5 }

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(5)
        expect(r.events[0].index).toEqual(1)
        expect(r.events[4].index).toEqual(5)

        expect(r.events[0].date.toISOString()).toEqual(
            '2023-01-09T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2024-01-08T10:00:00.000Z'
        )
        expect(r.events[2].date.toISOString()).toEqual(
            '2025-01-13T10:00:00.000Z'
        )
        expect(r.events[3].date.toISOString()).toEqual(
            '2026-01-12T10:00:00.000Z'
        )
        expect(r.events[4].date.toISOString()).toEqual(
            '2027-01-11T10:00:00.000Z'
        )
    }
})

test(`expand rRule Year byMonth bySetPos in range`, () => {
    const rRule =
        'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYDAY=MO;BYMONTH=1;BYSETPOS=2;COUNT=6;WKST=SU'

    const r = expandRRuleFromString(
        rRule,
        new Date('2023-02-28T10:00:00.000Z'),
        new Date('2038-05-31T10:00:00.000Z')
    )
    const r2 = expandRRuleFromString(
        rRule,
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2038-05-31T10:00:00.000Z')
    )

    //   { date: 2023-01-09T10:00:00.000Z, index: 1 },
    //   { date: 2024-01-08T10:00:00.000Z, index: 2 },
    //   { date: 2025-01-13T10:00:00.000Z, index: 3 },
    //   { date: 2026-01-12T10:00:00.000Z, index: 4 },
    //   { date: 2027-01-11T10:00:00.000Z, index: 5 },
    //   { date: 2028-01-10T10:00:00.000Z, index: 6 }

    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(5)

        expect(r.events[0].date.toISOString()).toEqual(
            '2024-01-08T10:00:00.000Z'
        )
        expect(r.events[1].date.toISOString()).toEqual(
            '2025-01-13T10:00:00.000Z'
        )

        const index = 5
        const d1 = r.events.find((x) => x.index === index)
        const d2 = r2.events.find((x) => x.index === index)
        expect(d1?.date).toEqual(d2?.date)
    }
})
