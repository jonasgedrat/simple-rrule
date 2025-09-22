import { describe, it, expect } from 'vitest'
import { getRRuleString } from '../src/getRrule'
import { Frequency } from '../src/types'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { toRRuleDateString } from '../src/dates'
import { Weekday } from '../src/types'
import { schedulerEditorDefaultValues } from '../src/validators/scheduler'

let d = {
    ...schedulerEditorDefaultValues,
    dtStart: new Date('2022-12-15T00:00:00.000Z'),
    dtEnd: new Date('2022-12-15T01:00:00.000Z'),
}

export const dtStart = `  DTSTART:${toRRuleDateString(d.dtStart)}\n\r
DTEND:${toRRuleDateString(d.dtEnd)}

\n

`

describe('parseRRule', () => {
    it(`parseRecurrenceFromString with poor rRule string`, () => {
        const s = `${dtStart}  RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221215T152030Z;WKST=SU     `

        const r = parseRecurrenceFromString(s, Weekday.Sunday)
        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual(Frequency.WEEKLY)
            expect(r.interval).toEqual(1)
            expect(r.dtStart).toEqual(d.dtStart)
            expect(r.until).toEqual(new Date('2022-12-15T15:20:30.000Z'))
        }
    })

    it(`parseRecurrenceFromString  RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3;WKST=SU`, () => {
        const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3;WKST=SU`
        const r = parseRecurrenceFromString(s, Weekday.Sunday)
        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual(Frequency.WEEKLY)
            expect(r.interval).toEqual(1)
            expect(r.count).toEqual(3)
            expect(r.dtStart.toISOString()).toEqual('2022-11-01T13:30:45.000Z')
            expect(r.dtEnd.toISOString()).toEqual('2022-11-03T13:30:45.000Z')
            expect(r.wkst === 'SU')
        }
    })

    it(`parseRecurrenceFromString  RRULE:FREQ=DAILY;INTERVAL=99;COUNT=99;WKST=SU`, () => {
        const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;INTERVAL=99;COUNT=99;WKST=SU`
        const r = parseRecurrenceFromString(s, Weekday.Sunday)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual(Frequency.DAILY)
            expect(r.interval).toEqual(99)
            expect(r.count).toEqual(99)
            expect(r.dtStart.toISOString()).toEqual('2022-11-01T13:30:45.000Z')
            expect(r.dtEnd.toISOString()).toEqual('2022-11-03T13:30:45.000Z')
            expect(r.wkst).toEqual('SU')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test1`, () => {
        const s = getRRuleString({
            ...schedulerEditorDefaultValues,
            frequency: Frequency.HOURLY,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(0)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('HOURLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test2`, () => {
        const s = getRRuleString({
            ...schedulerEditorDefaultValues,
            frequency: Frequency.WEEKLY,
            byDay: 'MO,FR',
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(0)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('MO,FR')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('WEEKLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test3`, () => {
        const s = getRRuleString({
            ...schedulerEditorDefaultValues,
            frequency: Frequency.MONTHLY,
            bySetPos: 1,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(1)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('MONTHLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test4`, () => {
        const s = getRRuleString({
            ...schedulerEditorDefaultValues,
            frequency: Frequency.MONTHLY,
            bySetPos: 1,
            byMonthDay: 2,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(1)
            expect(r.byMonthDay).toEqual(2)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('MONTHLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test5`, () => {
        const s = getRRuleString({
            ...schedulerEditorDefaultValues,
            frequency: Frequency.YEARLY,
            bySetPos: -1,
            byMonthDay: 12,
            byMonth: 3,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(-1)
            expect(r.byMonthDay).toEqual(12)
            expect(r.byMonth).toEqual(3)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('YEARLY')
        }
    })
})
