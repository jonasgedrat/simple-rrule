import { addDays, addHours, addMinutes, addYears, startOfDay } from 'date-fns'
import { expandRRule } from '../expandRrule'
import { parseRecurrenceFromString } from '../parseRrule'
import { toRRuleDateString } from '../rRuleDateStringFormat'
import { Frequency, Weekday } from '../types'

const today = addDays(startOfDay(new Date()), -1)
const startPeriod = addYears(today, -2)
const endPeriod = addYears(today, 10)

const dtStart = `DTSTART:${toRRuleDateString(today)}`
// const dtUntil = `UNTIL=${toRRuleDateString(addMonths(today, 2))}`

test('expandRRule variables tests', () => {
    expect(today).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
})

const intervals = [1, 2, 3]
const frequencies = [
    Frequency.MINUTELY,
    Frequency.HOURLY,
    Frequency.DAILY,
    Frequency.WEEKLY,
    //Frequency.MONTHLY,
    //Frequency.YEARLY,
]

// eslint-disable-next-line array-callback-return
intervals.map((interval) => {
    // eslint-disable-next-line array-callback-return
    frequencies.map((frequency) => {
        test(`expandRRule date-fns frequency: ${frequency} interval: ${interval} count: 3`, () => {
            const rRuleString = `${dtStart}\nRRULE:FREQ=${frequency};INTERVAL=${interval};COUNT=3;WKST=SU`

            const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
            expect(rRule).not.toBeUndefined()

            if (rRule) {
                expect(rRule.interval).toEqual(interval)
                expect(rRule.frequency).toEqual(frequency)
                expect(rRule.count).toEqual(3)

                const ex = expandRRule(rRule, startPeriod, endPeriod)
                expect(ex).not.toBeUndefined()
                expect(ex.events.length).toEqual(3)
                expect(ex.events[0].date).toBeInstanceOf(Date)

                // eslint-disable-next-line array-callback-return
                ex.events.map((e, i) => {
                    expect(e.index).toEqual(i + 1)

                    switch (frequency) {
                        case Frequency.MINUTELY:
                            expect(e.date).toEqual(
                                addMinutes(today, i * interval)
                            )
                            break
                        case Frequency.HOURLY:
                            expect(e.date).toEqual(
                                addHours(today, i * interval)
                            )
                            break
                        case Frequency.DAILY:
                            expect(e.date).toEqual(addDays(today, i * interval))
                            break
                        case Frequency.WEEKLY:
                            expect(e.date).toEqual(
                                addDays(today, i * interval * 7)
                            )
                            break
                        // case Frequency.MONTHLY:
                        //     expect(e.date).toEqual(addMonths(today, i * interval))
                        //     break
                        // case Frequency.YEARLY:
                        //     expect(e.date).toEqual(addYears(today, i * interval))
                        //     break

                        default:
                    }
                })
            }
        })
    })
})
