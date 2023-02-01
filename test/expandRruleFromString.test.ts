import { expandRRuleFromString } from '../src/expandRrule'

const _startDate = new Date('2022-12-01T13:30:45.000Z')
const _endDate = new Date('2022-12-31T13:30:45.000Z')

test(`expand rRule from string`, () => {
    const rRule = `DTSTART:20221010T070000Z\nDTEND:20221010T080000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=3;WKST=SU`
    const r = expandRRuleFromString(rRule, _startDate, _endDate)
    expect(r).not.toBeUndefined()
    if (r) {
        expect(r.events.length).toEqual(1)
        expect(r.events[0].index).toEqual(2)
    }
})

// test(`expand rRule from string`, () => {
//     const rRule = `DTSTART:20221010T070000Z\nDTEND:20221010T080000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=3;WKST=SU`
//     const r = expandRRuleFromString(rRule, _startDate, _endDate)
//     expect(r).not.toBeUndefined()
//     if (r) {
//         expect(r.events.length).toEqual(1)
//         expect(r.events[0].index).toEqual(2)
//     }
// })

// test(`expand rRule from string`, () => {
//     const rRule = `DTSTART:${toRRuleDateString(
//         today
//     )}\nRRULE:FREQ=DAILY;INTERVAL=1;COUNT=3;WKST=SU`

//     const r = expandRRuleFromString(rRule, today, addDays(today, 3))

//     expect(r).not.toBeUndefined()
//     if (r) {
//         expect(r.events.length).toEqual(3)
//         expect(r.events[0].index).toEqual(1)
//     }
// })

// DTSTART:20221010T070000Z
// DTEND:20221010T080000Z
// RRULE:FREQ=MONTHLY;BYMONTHDAY=3;WKST=SU
