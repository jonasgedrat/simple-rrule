import { getRRuleString } from '../src/getRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { schedulerEditorDefaultValues } from '../src/schedulerEditorSchema'
import { Frequency, Weekday } from '../src/types'

let d = {
    ...schedulerEditorDefaultValues,
    dtStart: new Date('2022-12-15T00:00:00.000Z'),
    dtEnd: new Date('2022-12-15T01:00:00.000Z'),
}

export const dtStart = `DTSTART:${toRRuleDateString(
    d.dtStart
)}\nDTEND:${toRRuleDateString(d.dtEnd)}\n`

test(`getRRuleString`, () => {
    const expectations: [string, string][] = [
        [
            getRRuleString({
                ...d,
                frequency: Frequency.WEEKLY,
                until: new Date('2022-12-20T01:00:00.000Z'),
            }),
            `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221220T010000Z;WKST=SU`,
        ],
        [
            getRRuleString({
                ...d,
                frequency: Frequency.DAILY,
            }),
            `${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;WKST=SU`,
        ],
        [
            getRRuleString({
                ...d,
                interval: 3,
                frequency: Frequency.WEEKLY,
            }),
            `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=3;WKST=SU`,
        ],
        [
            getRRuleString({
                ...d,
                byDay: 'SU,MO,FR',
                frequency: Frequency.WEEKLY,
            }),
            `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,MO,FR;WKST=SU`,
        ],
        [
            getRRuleString({
                ...d,
                frequency: Frequency.YEARLY,
                wkst: Weekday.Saturday,
            }),
            `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;WKST=SA`,
        ],
    ]

    expectations.map((i) => {
        expect(i[0]).toEqual(i[1])
    })
})
