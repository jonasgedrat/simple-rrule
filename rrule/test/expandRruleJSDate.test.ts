import { describe, expect, it, jest } from '@jest/globals'
import { expandRRule } from '../expandRrule'
import { parseRecurrenceFromString } from '../parseRrule'
import { toRRuleDateString } from '../rRuleDateStringFormat'
import { Frequency, Weekday } from '../types'

const year = 2020
const month = 1
const day = 1
const hour = 0
const minute = 0

const today = new Date(year, month, day, hour, minute)
const startPeriod = new Date(year - 2, month, day, hour, minute)
const endPeriod = new Date(year + 10, month, day, hour, minute)

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
    //Frequency.MONTHLY,
    //Frequency.YEARLY,
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
