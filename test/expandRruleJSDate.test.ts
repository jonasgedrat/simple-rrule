import { addDays, addHours, addMinutes } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { toRRuleDateString } from '../src/rRuleDateStringFormat'
import { Frequency, Weekday } from '../src/types'

const year = 2020
const month = 1
const day = 1
const hour = 0
const minute = 0

const today = new Date(year, month, day, hour, minute)
let startPeriod = new Date(year - 2, month, day, hour, minute)
let endPeriod = new Date(year + 10, month, day, hour, minute)

const dtStart = `DTSTART:${toRRuleDateString(today)}`

test('expandRRule variables tests', () => {
    expect(today).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
    expect(startPeriod).toBeInstanceOf(Date)
})

const intervals = [1, 3]
const frequencies = [
    Frequency.MINUTELY,
    Frequency.HOURLY,
    Frequency.DAILY,
    Frequency.WEEKLY,
]

// eslint-disable-next-line array-callback-return
intervals.map((interval) => {
    // eslint-disable-next-line array-callback-return
    frequencies.map((frequency) => {
        test(`expandRRule JS Date frequency: ${frequency} interval: ${interval} count: 3`, () => {
            const rRuleString = `${dtStart}\nRRULE:FREQ=${frequency};INTERVAL=${interval};COUNT=3;WKST=SU`

            const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
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
                                new Date(
                                    year,
                                    month,
                                    day,
                                    hour,
                                    minute + i * interval
                                )
                            )
                            break
                        case Frequency.HOURLY:
                            expect(e.date).toEqual(
                                new Date(
                                    year,
                                    month,
                                    day,
                                    hour + i * interval,
                                    minute
                                )
                            )
                            break
                        case Frequency.DAILY:
                            expect(e.date).toEqual(
                                new Date(
                                    year,
                                    month,
                                    day + i * interval,
                                    hour,
                                    minute
                                )
                            )
                            break
                        case Frequency.WEEKLY:
                            expect(e.date).toEqual(
                                new Date(
                                    year,
                                    month,
                                    day + i * interval * 7,
                                    hour,
                                    minute
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
