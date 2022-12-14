import { addDays, addHours, addMinutes } from 'date-fns'
import { expandRRule } from '../src/expandRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { Frequency, Weekday } from '../src/types'
import { dtStart, frequencies, intervals } from './constants'

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

                let startPeriod = addMinutes(rRule.dtStart, interval * -1)
                let endPeriod = new Date()

                //adjust date to performance
                switch (frequency) {
                    case Frequency.MINUTELY:
                        endPeriod = addMinutes(rRule.dtStart, interval * 4)
                        break
                    case Frequency.HOURLY:
                        endPeriod = addHours(rRule.dtStart, interval * 4)
                        break
                    case Frequency.DAILY:
                        endPeriod = addDays(rRule.dtStart, interval * 4)
                        break
                    case Frequency.WEEKLY:
                        endPeriod = addDays(rRule.dtStart, interval * 4 * 7)
                        break
                    default:
                }

                const ex = expandRRule(rRule, startPeriod, endPeriod)

                console.log(
                    'rRuleStart',
                    rRule.dtStart,
                    'startPeriod',
                    startPeriod
                )
                // console.log('rRule', rRule)

                console.log('ex.events', ex.events)

                //console.log('result', result)

                expect(ex).not.toBeUndefined()
                expect(ex.events.length).toEqual(3)
                expect(ex.events[0].date).toBeInstanceOf(Date)

                // eslint-disable-next-line array-callback-return
                ex.events.map((e, i) => {
                    expect(e.index).toEqual(i + 1)

                    switch (frequency) {
                        case Frequency.MINUTELY:
                            expect(e.date).toEqual(
                                addMinutes(rRule.dtStart, i * interval)
                            )
                            break
                        case Frequency.HOURLY:
                            expect(e.date).toEqual(
                                addHours(rRule.dtStart, i * interval)
                            )
                            break
                        case Frequency.DAILY:
                            expect(e.date).toEqual(
                                addDays(rRule.dtStart, i * interval)
                            )
                            break
                        case Frequency.WEEKLY:
                            expect(e.date).toEqual(
                                addDays(rRule.dtStart, i * interval * 7)
                            )
                            break

                        default:
                    }
                })
            }
        })
    })
})
