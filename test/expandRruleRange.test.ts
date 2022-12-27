import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { Frequency, Weekday } from '../src/types'
import { dtStart, intervals, d, frequencies } from './constants'

const rangeStartInterval = 27
const rangeEndInterval = 30

// eslint-disable-next-line array-callback-return
intervals.map((interval) => {
    // eslint-disable-next-line array-callback-return
    frequencies.map((frequency) => {
        test(`expandRRule Range frequency: ${frequency} interval: ${interval} `, () => {
            const rRuleString = `${dtStart}\nRRULE:FREQ=${frequency};INTERVAL=${interval};WKST=SU`

            const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
            expect(rRule).not.toBeUndefined()

            if (rRule) {
                expect(rRule.interval).toEqual(interval)
                expect(rRule.frequency).toEqual(frequency)

                let startPeriod = new Date()
                let endPeriod = new Date()

                switch (frequency) {
                    case Frequency.MINUTELY:
                        startPeriod = new Date(
                            d.year,
                            d.month,
                            d.day,
                            d.hour,
                            d.minute + rangeStartInterval * interval,
                            d.second
                        )
                        endPeriod = new Date(
                            d.year,
                            d.month,
                            d.day,
                            d.hour,
                            d.minute + rangeEndInterval * interval,
                            d.second
                        )
                        break
                    case Frequency.HOURLY:
                        startPeriod = new Date(
                            d.year,
                            d.month,
                            d.day,
                            d.hour + rangeStartInterval * interval,
                            d.minute,
                            d.second
                        )
                        endPeriod = new Date(
                            d.year,
                            d.month,
                            d.day,
                            d.hour + rangeEndInterval * interval,
                            d.minute,
                            d.second
                        )

                        break
                    case Frequency.DAILY:
                        startPeriod = new Date(
                            d.year,
                            d.month,
                            d.day + rangeStartInterval * interval,
                            d.hour,
                            d.minute,
                            d.second
                        )
                        endPeriod = new Date(
                            d.year,
                            d.month,
                            d.day + rangeEndInterval * interval,
                            d.hour,
                            d.minute,
                            d.second
                        )

                        break
                    case Frequency.WEEKLY:
                        startPeriod = new Date(
                            d.year,
                            d.month,
                            d.day + rangeStartInterval * interval * 7,
                            d.hour,
                            d.minute,
                            d.second
                        )
                        endPeriod = new Date(
                            d.year,
                            d.month,
                            d.day + rangeEndInterval * interval * 7,
                            d.hour,
                            d.minute,
                            d.second
                        )

                        break

                    default:
                }

                const ex = expandRRule(rRule, startPeriod, endPeriod)

                expect(ex).not.toBeUndefined()

                const lastEvent = ex.events.pop()

                expect(ex.events[0].index).toEqual(rangeStartInterval + 1)
                expect(lastEvent?.index).toEqual(rangeEndInterval + 1)

                switch (frequency) {
                    case Frequency.MINUTELY:
                        expect(ex.events[0].date).toEqual(
                            new Date(
                                d.year,
                                d.month,
                                d.day,
                                d.hour,
                                d.minute +
                                    ex.events[0].index * interval -
                                    interval,
                                d.second
                            )
                        )
                        break
                    case Frequency.HOURLY:
                        expect(ex.events[0].date).toEqual(
                            new Date(
                                d.year,
                                d.month,
                                d.day,
                                d.hour +
                                    ex.events[0].index * interval -
                                    interval,
                                d.minute,
                                d.second
                            )
                        )

                        break
                    case Frequency.DAILY:
                        expect(ex.events[0].date).toEqual(
                            new Date(
                                d.year,
                                d.month,
                                d.day +
                                    ex.events[0].index * interval -
                                    interval,
                                d.hour,
                                d.minute,
                                d.second
                            )
                        )

                        break
                    case Frequency.WEEKLY:
                        expect(ex.events[0].date).toEqual(
                            new Date(
                                d.year,
                                d.month,
                                d.day +
                                    (ex.events[0].index * interval - interval) *
                                        7,
                                d.hour,
                                d.minute,
                                d.second
                            )
                        )

                        break

                    default:
                }

                //expect(ex.events[10].index).toEqual(21)
            }
        })
    })
})
