import { getRRuleString } from '../src/getRrule'
import { Frequency, schedulerEditorDefault } from '../src/types'

let d = {
    ...schedulerEditorDefault,
    dtStart: new Date(Date.UTC(2020, 11, 15)),
    dtEnd: new Date(2020, 11, 15, 1, 15),
}

test(`getRRuleString`, () => {
    expect(
        getRRuleString({
            ...d,
            frequency: Frequency.WEEKLY,
            until: new Date(2010, 1, 1, 0, 0, 0),
        })
    ).toEqual('RRULE:FREQ=WEEKLY;UNTIL=20100101T000000Z')
})
