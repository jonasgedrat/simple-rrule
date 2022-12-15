import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addYears,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
    eachDayOfInterval,
    eachHourOfInterval,
    eachMinuteOfInterval,
    eachMonthOfInterval,
    eachYearOfInterval,
    format,
    Interval,
    isBefore,
    setDate,
} from 'date-fns'
import { parseRecurrenceFromString } from './parseRrule'

import { Frequency, IRrule, IRuleExtended, Weekday } from './types'

export interface IDateEvents {
    date: Date
    index: number
}

export interface IExpandResult {
    r: IRuleExtended
    events: IDateEvents[]
}

export const expandRRuleFromString = (
    rRuleString: string,
    startRangePeriod: Date,
    endRangePeriod: Date,
    wkst: Weekday = Weekday.Sunday
): IExpandResult | undefined => {
    const rRule = parseRecurrenceFromString(rRuleString, wkst)
    if (rRule) {
        return expandRRule(rRule, startRangePeriod, endRangePeriod)
    }
    return undefined
}

export const expandRRule = (
    rRule: IRrule,
    startRangePeriod: Date,
    endRangePeriod: Date,
    minimalSecondsDuration: number = 60 * 5 //5 minutes
): IExpandResult => {
    // console.log('expandRRule rRule',rRule)
    // console.log('expandRRule startRangePeriod', rRule)

    const r = validateAndAdjustRRule(
        rRule,
        startRangePeriod,
        endRangePeriod,
        minimalSecondsDuration
    )

    // console.log('r', r)

    if (r.hasErrors) {
        return {
            r: r,
            events: [],
        }
    }

    const result = {
        r: r,
        events: getEventsByFrequency(r),
    }

    // console.log(result)
    return result
}

const getEventsByFrequency = (r: IRuleExtended): IDateEvents[] => {
    let dates: Date[] = []

    if (isBefore(r.endRangePeriodOrUntil, r.firstEventInRangePeriod)) return []

    const interval: Interval = {
        start: r.firstEventInRangePeriod,
        end: r.endRangePeriodOrUntil,
    }

    const step = {
        step: r.frequency === Frequency.WEEKLY ? r.interval * 7 : r.interval,
    }

    // console.log('interval', interval, 'step', step)

    switch (r.frequency) {
        case Frequency.SECONDLY:
            //not implemented
            break
        case Frequency.MINUTELY:
            dates = eachMinuteOfInterval(interval, step)
            break
        case Frequency.HOURLY:
            dates = eachHourOfInterval(interval, step)
            break
        case Frequency.DAILY:
            dates = eachDayOfInterval(interval, step)
            break
        case Frequency.WEEKLY:
            if (r.byDay && r.byDay.length > 0) {
                let resultWeekly: Date[] = []

                const weekDays = r.byDay?.split(',')
                r.startIndexCount = r.startIndexCount * weekDays.length

                const eachDay = eachDayOfInterval(interval, {
                    step: r.interval,
                })

                eachDay.map((day) => {
                    const dayOfWeek = format(day, 'EEEEEE').toLocaleUpperCase()
                    if (weekDays?.includes(dayOfWeek)) {
                        resultWeekly.push(day)
                    }
                    return undefined
                })

                dates = resultWeekly
            } else {
                dates = eachDayOfInterval(interval, step)
            }

            break
        case Frequency.MONTHLY:
            if (r.byMonthDay && r.byMonthDay > 0) {
                dates = eachMonthOfInterval(interval)
                dates = dates.map((x) => setDate(x, r?.byMonthDay!!))
                break
            }
            dates = eachMonthOfInterval(interval)
            break
        case Frequency.YEARLY:
            //console.log('yearly interval', interval)
            dates = eachYearOfInterval(interval)
            break
        default:
    }

    //adjust hour/minute/second
    switch (r.frequency) {
        case Frequency.MINUTELY:
            dates = dates.map((x) => {
                return new Date(x.setSeconds(r.dtStart.getSeconds()))
            })
            break
        case Frequency.HOURLY:
            dates = dates.map((x) => {
                const rH = new Date(x.setMinutes(r.dtStart.getMinutes()))
                return new Date(rH.setSeconds(r.dtStart.getSeconds()))
            })
            break
        case Frequency.DAILY:
        case Frequency.WEEKLY:
            dates = dates.map((x) => {
                return new Date(
                    x.setUTCHours(
                        r.dtStart.getUTCHours(),
                        r.dtStart.getMinutes(),
                        r.dtStart.getSeconds()
                    )
                )
            })
            break
        default:
    }

    const result: IDateEvents[] = dates
        .map((x, i) => {
            // console.log('date in expandResult Map:', x)

            return {
                date: x,
                index: r.startIndexCount + i + 1,
            }
        })
        .filter((y) => {
            let filterResult = false
            filterResult = y.date >= r.startRangePeriod

            if (r.count > 0 && y.index > r.count) {
                filterResult = false
            }
            return filterResult
        })

    //console.log(result)

    return result
}

const validateAndAdjustRRule = (
    rRule: IRrule,
    startRangePeriod: Date,
    endRangePeriod: Date,
    minimalSecondsDuration: number = 60 * 60 * 5
): IRuleExtended => {
    const result: IRuleExtended = {
        ...rRule,
        count: rRule.count && rRule.count > 0 ? rRule.count : 0,
        startRangePeriod:
            rRule.dtStart > startRangePeriod ? rRule.dtStart : startRangePeriod,
        endRangePeriodOrUntil:
            !!rRule.until && rRule.until < endRangePeriod
                ? rRule.until
                : endRangePeriod,
        secondsDuration: !rRule.dtEnd
            ? minimalSecondsDuration
            : differenceInSeconds(rRule.dtEnd, rRule.dtStart),
        hasErrors: false,
        errorMessages: '',
        eventsCount: 0,
        startIndexCount: 0,
        firstEventInRangePeriod: rRule.dtStart,
    }

    if (result.secondsDuration > 0 && !!rRule.until && rRule.until) {
        result.endRangePeriodOrUntil = addSeconds(
            result.endRangePeriodOrUntil,
            -result.secondsDuration
        )
    }
    if (!rRule.dtEnd) {
        result.dtEnd = addSeconds(rRule.dtStart, minimalSecondsDuration)
    } else if (rRule.dtStart > rRule.dtEnd) {
        result.hasErrors = true
        result.errorMessages +=
            `\nInvalid recurrence rule: Start date (${rRule.dtStart})` +
            `is greater than End date ${rRule.dtStart}`
    }

    if (!!rRule.until && rRule.until < result.startRangePeriod) {
        result.hasErrors = true
        result.errorMessages +=
            `\nInvalid recurrence rule: _startRangePeriod date (${result.startRangePeriod})` +
            `is greater than until date ${rRule.until}`
    }

    if (!result.hasErrors && result.dtStart < result.startRangePeriod) {
        const r = setStartIndexCountAndFirstEventInRangePeriod(result)
        return r
    }

    return result
}

const setStartIndexCountAndFirstEventInRangePeriod = (
    r: IRuleExtended
): IRuleExtended => {
    let result = r
    let durationInFrequency = 0
    let durationFromStart = 0
    let eventCountsFromDtStart = 0
    switch (r.frequency) {
        case Frequency.SECONDLY:
            //not implemented
            break
        case Frequency.MINUTELY:
            durationInFrequency = differenceInMinutes(
                addDays(r.dtStart, r.interval),
                r.dtStart
            )
            durationFromStart = differenceInMinutes(
                r.startRangePeriod,
                r.dtStart
            )
            eventCountsFromDtStart = Math.ceil(
                durationFromStart / durationInFrequency
            )
            result.firstEventInRangePeriod = addMinutes(
                r.dtStart,
                eventCountsFromDtStart * r.interval
            )

            break
        case Frequency.HOURLY:
            durationInFrequency = differenceInHours(
                addDays(r.dtStart, r.interval),
                r.dtStart
            )
            durationFromStart = differenceInHours(r.startRangePeriod, r.dtStart)
            eventCountsFromDtStart = Math.ceil(
                durationFromStart / durationInFrequency
            )
            result.firstEventInRangePeriod = addHours(
                r.dtStart,
                eventCountsFromDtStart * r.interval
            )
            break
        case Frequency.DAILY:
            durationInFrequency = differenceInDays(
                addDays(r.dtStart, r.interval),
                r.dtStart
            )
            durationFromStart = differenceInDays(r.startRangePeriod, r.dtStart)
            eventCountsFromDtStart = Math.ceil(
                durationFromStart / durationInFrequency
            )
            result.firstEventInRangePeriod = addDays(
                r.dtStart,
                eventCountsFromDtStart * r.interval
            )

            break
        case Frequency.WEEKLY:
            durationInFrequency = differenceInDays(
                addDays(r.dtStart, r.interval * 7),
                r.dtStart
            )
            durationFromStart = differenceInWeeks(r.startRangePeriod, r.dtStart)

            eventCountsFromDtStart = Math.ceil(
                durationFromStart / durationInFrequency
            )

            result.firstEventInRangePeriod = addDays(
                r.dtStart,
                eventCountsFromDtStart * (r.interval * 7)
            )

            break
        case Frequency.MONTHLY:
            eventCountsFromDtStart = differenceInMonths(
                r.startRangePeriod,
                r.dtStart
            )

            if (eventCountsFromDtStart > 0) {
                result.firstEventInRangePeriod = addMonths(
                    r.dtStart,
                    eventCountsFromDtStart
                )
            }

            break
        case Frequency.YEARLY:
            eventCountsFromDtStart = differenceInYears(
                r.startRangePeriod,
                r.dtStart
            )

            if (eventCountsFromDtStart > 0) {
                result.firstEventInRangePeriod = addYears(
                    r.dtStart,
                    eventCountsFromDtStart
                )
            }

            break
        default:
    }

    if (r.count > 0 && eventCountsFromDtStart > r.count) {
        result.hasErrors = true
        result.errorMessages += `\nInvalid recurrence rule: event is finished by count`
        return result
    }

    result.startIndexCount = eventCountsFromDtStart

    // console.log('result', result)
    return result
}
