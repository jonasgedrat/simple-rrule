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

const dtStart = `DTSTART:${toRRuleDateString(today)}`

const rangeStartInterval = 27
const rangeEndInterval = 30

const intervals = [3, 5]
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
        test(`expandRRule JS Date frequency: ${frequency} interval: ${interval} `, () => {
            const rRuleString = `${dtStart}\nRRULE:FREQ=${frequency};INTERVAL=${interval};WKST=SU`

            const rRule = parseRecurrenceFromString(rRuleString, Weekday.Sunday)
            expect(rRule).not.toBeUndefined()

            if (rRule) {
                expect(rRule.interval).toEqual(interval)
                expect(rRule.frequency).toEqual(frequency)

                let startPeriod = new Date(year - 2, month, day, hour, minute)
                let endPeriod = new Date(year + 10, month, day, hour, minute)

                switch (frequency) {
                    case Frequency.MINUTELY:
                        startPeriod = new Date(
                            year,
                            month,
                            day,
                            hour,
                            minute + rangeStartInterval * interval
                        )
                        endPeriod = new Date(
                            year,
                            month,
                            day,
                            hour,
                            minute + rangeEndInterval * interval
                        )
                        break
                    case Frequency.HOURLY:
                        startPeriod = new Date(
                            year,
                            month,
                            day,
                            hour + rangeStartInterval * interval,
                            minute
                        )
                        endPeriod = new Date(
                            year,
                            month,
                            day,
                            hour + rangeEndInterval * interval,
                            minute
                        )

                        break
                    case Frequency.DAILY:
                        startPeriod = new Date(
                            year,
                            month,
                            day + rangeStartInterval * interval,
                            hour,
                            minute
                        )
                        endPeriod = new Date(
                            year,
                            month,
                            day + rangeEndInterval * interval,
                            hour,
                            minute
                        )

                        break
                    case Frequency.WEEKLY:
                        startPeriod = new Date(
                            year,
                            month,
                            day + rangeStartInterval * interval * 7,
                            hour,
                            minute
                        )
                        endPeriod = new Date(
                            year,
                            month,
                            day + rangeEndInterval * interval * 7,
                            hour,
                            minute
                        )

                        break

                    default:
                }

                const ex = expandRRule(rRule, startPeriod, endPeriod)

                expect(ex).not.toBeUndefined()

                const lastEvent = ex.events.pop()

                expect(ex.events[0].index).toEqual(rangeStartInterval + 1)
                expect(lastEvent?.index).toEqual(rangeEndInterval + 1)

                // console.log(ex.events)

                // if (frequency === Frequency.WEEKLY) {
                // console.log(
                //     `first event frequency: ${frequency} interval: ${interval}:`,
                //     ex.events[0]
                // )
                // console.log(
                //     `last event frequency: ${frequency} interval: ${interval}:`,
                //     lastEvent
                // )
                // }

                switch (frequency) {
                    case Frequency.MINUTELY:
                        expect(ex.events[0].date.toISOString()).toEqual(
                            new Date(
                                year,
                                month,
                                day,
                                hour,
                                minute +
                                    ex.events[0].index * interval -
                                    interval
                            ).toISOString()
                        )
                        break
                    case Frequency.HOURLY:
                        expect(ex.events[0].date.toISOString()).toEqual(
                            new Date(
                                year,
                                month,
                                day,
                                hour + ex.events[0].index * interval - interval,
                                minute
                            ).toISOString()
                        )

                        break
                    case Frequency.DAILY:
                        expect(ex.events[0].date.toISOString()).toEqual(
                            new Date(
                                year,
                                month,
                                day + ex.events[0].index * interval - interval,
                                hour,
                                minute
                            ).toISOString()
                        )

                        break
                    case Frequency.WEEKLY:
                        expect(ex.events[0].date.toISOString()).toEqual(
                            new Date(
                                year,
                                month,
                                day +
                                    (ex.events[0].index * interval - interval) *
                                        7,
                                hour,
                                minute
                            ).toISOString()
                        )

                        break

                    default:
                }

                //expect(ex.events[10].index).toEqual(21)
            }
        })
    })
})
