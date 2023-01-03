import { Frequency } from './../src/types'
import { parseRecurrenceFromString } from './../src/parseRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
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

test(`parseRecurrenceFromString with poor rRule string`, () => {
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

test(`parseRecurrenceFromString  rRule string`, () => {
    const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\n
        RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3;WKST=SU`

    const r = parseRecurrenceFromString(s, Weekday.Sunday)
    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.frequency).toEqual(Frequency.WEEKLY)
        expect(r.interval).toEqual(1)
        expect(r.count).toEqual(3)
        expect(r.dtStart.toISOString()).toEqual('2022-11-01T13:30:45.000Z')
        expect(r.dtEnd.toISOString()).toEqual('2022-11-03T13:30:45.000Z')
    }
})
