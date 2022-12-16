import { addDays, addHours, addMinutes } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { Frequency, Weekday } from '../src/types'
import { dtStart, intervals, today, d, frequencies } from './constants'

let startPeriod = new Date()
let endPeriod = new Date()

test('expandRRule variables tests', () => {
    expect(today).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
})

// eslint-disable-next-line array-callback-return
intervals.map((interval) => {
    // eslint-disable-next-line array-callback-return
    frequencies.map((frequency) => {
        test(`expandRRule JS Date frequency: ${frequency} interval: ${interval} count: 3`, async () => {
            const rRuleString = `${dtStart}\nRRULE:FREQ=${frequency};INTERVAL=${interval};COUNT=3;WKST=SU`

            const rRule = await parseRecurrenceFromString(
                rRuleString,
                Weekday.Sunday
            )
            expect(rRule).not.toBeUndefined()

            if (rRule) {
                expect(rRule.interval).toEqual(interval)
                expect(rRule.frequency).toEqual(frequency)
                expect(rRule.count).toEqual(3)

                //adjust date to performance
                switch (frequency) {
                    case Frequency.MINUTELY:
                        startPeriod = addMinutes(today, -2)
                        endPeriod = addMinutes(today, 10)
                        break
                    case Frequency.HOURLY:
                        startPeriod = addHours(today, -2)
                        endPeriod = addHours(today, 10)
                        break
                    case Frequency.DAILY:
                        startPeriod = addDays(today, -2)
                        endPeriod = addDays(today, 10)
                        break
                    case Frequency.WEEKLY:
                        startPeriod = addDays(today, -2)
                        endPeriod = addDays(today, 10 * 7)
                        break
                    default:
                }

                const ex = await expandRRule(rRule, startPeriod, endPeriod)

                expect(ex).not.toBeUndefined()
                expect(ex.events.length).toEqual(3)
                expect(ex.events[0].date).toBeInstanceOf(Date)

                // eslint-disable-next-line array-callback-return
                ex.events.map((e, i) => {
                    expect(e.index).toEqual(i + 1)
                    switch (frequency) {
                        case Frequency.MINUTELY:
                            expect(e.date).toEqual(
                                new Date(
                                    d.year,
                                    d.month,
                                    d.day,
                                    d.hour,
                                    d.minute + i * interval,
                                    d.second
                                )
                            )
                            break
                        case Frequency.HOURLY:
                            expect(e.date).toEqual(
                                new Date(
                                    d.year,
                                    d.month,
                                    d.day,
                                    d.hour + i * interval,
                                    d.minute,
                                    d.second
                                )
                            )
                            break
                        case Frequency.DAILY:
                            expect(e.date).toEqual(
                                new Date(
                                    d.year,
                                    d.month,
                                    d.day + i * interval,
                                    d.hour,
                                    d.minute,
                                    d.second
                                )
                            )
                            break
                        case Frequency.WEEKLY:
                            expect(e.date).toEqual(
                                new Date(
                                    d.year,
                                    d.month,
                                    d.day + i * interval * 7,
                                    d.hour,
                                    d.minute,
                                    d.second
                                )
                            )
                            break

                        default:
                    }
                })
            }
        })
    })
})
