import { Frequency } from './../src/types'
import { parseRecurrenceFromString } from './../src/parseRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { Weekday } from '../src/types'
import { schedulerEditorDefaultValues } from '../src/schedulerEditorSchema'

let d = {
    ...schedulerEditorDefaultValues,
    dtStart: new Date('2022-12-15T00:00:00.000Z'),
    dtEnd: new Date('2022-12-15T01:00:00.000Z'),
}

export const dtStart = `DTSTART:${toRRuleDateString(
    d.dtStart
)}\nDTEND:${toRRuleDateString(d.dtEnd)}\n`

test(`parseRecurrenceFromString`, () => {
    const s = `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221215T152030Z;WKST=SU`

    const r = parseRecurrenceFromString(s, Weekday.Sunday)
    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.frequency).toEqual(Frequency.WEEKLY)
        expect(r.interval).toEqual(1)
        expect(r.dtStart).toEqual(d.dtStart)
        expect(r.until).toEqual(new Date('2022-12-15T15:20:30.000Z'))
    }
})
