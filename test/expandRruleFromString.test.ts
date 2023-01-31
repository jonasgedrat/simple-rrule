// import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { addDays } from '../src/dates/addDatesHelper'
import { expandRRuleFromString } from './../src/expandRrule'
import { today } from './constants'

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

test(`expand rRule from string`, () => {
    const rRule = `
DTSTART:20221010T071500Z
DTEND:20221010T223500Z
RRULE:FREQ=MONTHLY;BYMONTHDAY=3;WKST=SU;COUNT=3;`

    const r = expandRRuleFromString(rRule, today, addDays(today, 3000))

    console.log(r)

    expect(r).not.toBeUndefined()
    // if (r) {
    //     expect(r.events.length).toEqual(3)
    //     expect(r.events[0].index).toEqual(1)
    // }
})
