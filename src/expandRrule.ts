import {
    getBySetPos,
    eachMonthOfIntervalWithTime,
    eachYearOfIntervalWithTime,
} from './util'

import { ByDay, BySetPos } from './types'
import { IRrule, IRuleExtended, validateRrule } from './validators/rRule'
import { parseRecurrenceFromString } from './parseRrule'
import { isWeekDayValid } from './validators/util'
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
    eachDateOfInterval,
    getStartOfWeekWithoutChangeTime,
    getWeekDayFromDate,
    getWeekDayName,
    isBefore,
    setByDay,
    setByMonth,
} from './dates'

export interface IDateEvents {
    date: Date
    index: number
}
export interface IExpandResult {
    r: IRuleExtended
    events: IDateEvents[]
}

export const expandRRule = (
    rRulePayload: IRrule,
    startRangePeriod: Date,
    endRangePeriod: Date,
    minimalSecondsDuration: number = 60 * 5 //5 minutes
): IExpandResult => {
    const rRule = validateRrule(rRulePayload)
    const r = validateAndAdjustRRule(
        rRule,
        startRangePeriod,
        endRangePeriod,
        minimalSecondsDuration
    )

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

    return result
}

export const expandRRuleFromString = (
    rRuleString: string,
    startRangePeriod: Date,
    endRangePeriod: Date
): IExpandResult => {
    const rRule2 = parseRecurrenceFromString(rRuleString, 'SU')
    return expandRRule(rRule2!!, startRangePeriod, endRangePeriod)
}

const getEventsByFrequency = (r: IRuleExtended): IDateEvents[] => {
    let dates: Date[] = []

    const isBySetPos =
        (r.bySetPos !== 0 && r.byDay !== '' && r.frequency === 'MONTHLY') ||
        (r.bySetPos !== 0 &&
            r.byMonth !== 0 &&
            r.byDay !== '' &&
            r.frequency === 'YEARLY')

    if (isBefore(r.endRangePeriodOrUntil, r.firstEventInRangePeriod)) return []

    switch (r.frequency) {
        case 'SECONDLY':
            //not implemented
            break
        case 'MINUTELY':
            dates = eachDateOfInterval(
                r.firstEventInRangePeriod,
                r.endRangePeriodOrUntil,
                'minutes',
                r.interval
            )
            break
        case 'HOURLY':
            dates = eachDateOfInterval(
                r.firstEventInRangePeriod,
                r.endRangePeriodOrUntil,
                'hours',
                r.interval
            )
            break
        case 'DAILY':
            dates = eachDateOfInterval(
                r.firstEventInRangePeriod,
                r.endRangePeriodOrUntil,
                'days',
                r.interval
            )

            break
        case 'WEEKLY':
            if (r.byDay && r.byDay.length > 0) {
                let resultWeekly: Date[] = []

                const weekDays = r.byDay?.split(',')

                //throw error is weekDay is not valid
                weekDays.map((d) => {
                    isWeekDayValid(d as ByDay)
                })

                let starPeriodDate = new Date(r.firstEventInRangePeriod)
                let pastEvents = 0

                //semana anterior que teve evento
                while (
                    addDays(starPeriodDate, r.interval * 7) < r.startRangePeriod
                ) {
                    starPeriodDate = addDays(starPeriodDate, r.interval * 7)
                    pastEvents = pastEvents + weekDays.length
                }

                //crio os eventos a partir da ultima semana que teve eventos
                while (starPeriodDate < r.endRangePeriodOrUntil) {
                    let inWeekDate = new Date(starPeriodDate)

                    for (let i = 1; i <= 7; i++) {
                        if (weekDays?.includes(getWeekDayName(inWeekDate))) {
                            resultWeekly.push(new Date(inWeekDate))
                        }
                        inWeekDate = addDays(inWeekDate, 1)
                    }

                    starPeriodDate = new Date(
                        addDays(starPeriodDate, r.interval * 7)
                    )
                }

                r.startIndexCount = pastEvents
                dates = resultWeekly
            } else {
                dates = eachDateOfInterval(
                    r.firstEventInRangePeriod,
                    r.endRangePeriodOrUntil,
                    'weeks',
                    r.interval
                )
            }

            break
        case 'MONTHLY':
            dates = eachMonthOfIntervalWithTime(
                r.dtStart,
                r.endRangePeriodOrUntil,
                r.byMonthDay
            )

            if (isBySetPos) {
                dates = dates.reduce((acc: Date[], curr: Date) => {
                    const result = getBySetPos(
                        curr,
                        r.byDay as ByDay,
                        r.bySetPos as BySetPos,
                        r.count,
                        acc.length | 0
                    )

                    if (result) {
                        if (
                            result.getTime() >= r.dtStart.getTime() &&
                            result.getTime() <=
                                r.endRangePeriodOrUntil.getTime()
                        ) {
                            acc.push(result)
                        }
                    }
                    return acc
                }, [])
                r.startIndexCount = 0

                break
            }

            if (r.bySetPos === 0 && r.byMonthDay > 0) {
                //dates = dates.map(x=>x>=)
                //set monthDay

                r.startIndexCount = 0
                break
            }

            break

        case 'YEARLY':
            if (isBySetPos) {
                let currentYear = r.dtStart.getFullYear()
                //infinite loop
                while (true) {
                    const dt = getBySetPos(
                        new Date(
                            currentYear,
                            r.byMonth - 1,
                            1, //first day of month
                            r.dtStart.getHours(),
                            r.dtStart.getMinutes()
                        ),
                        r.byDay as ByDay,
                        r.bySetPos as BySetPos,
                        r.count,
                        dates.length
                    )

                    if (dt) {
                        if (
                            dt.getTime() <= r.endRangePeriodOrUntil.getTime() &&
                            dt.getTime() >= r.dtStart.getTime()
                        ) {
                            dates.push(dt)
                        }

                        if (dt.getTime() >= r.endRangePeriodOrUntil.getTime()) {
                            break
                        }

                        if (r.count > 0 && r.count <= dates.length) {
                            break
                        }
                    }

                    currentYear++
                }

                r.startIndexCount = 0

                break
            }

            dates = eachYearOfIntervalWithTime(
                r.dtStart,
                r.endRangePeriodOrUntil,
                r.byMonthDay
            )

            if (r.bySetPos === 0 && r.byMonth > 0 && r.byMonthDay > 0) {
                dates = dates.map((x) =>
                    setByMonth(setByDay(x, r.byMonthDay), r.byMonth)
                )
                r.startIndexCount = 0
                break
            }

            break
        default:
    }

    let result: IDateEvents[] = []

    switch (r.frequency) {
        case 'MONTHLY':
        case 'YEARLY':
            let index = 0

            result = dates.reduce((acc: IDateEvents[], curr) => {
                index++
                if (
                    curr.getTime() >= r.dtStart.getTime() &&
                    curr.getTime() >= r.startRangePeriod.getTime()
                ) {
                    acc.push({
                        date: curr,
                        index: index,
                    })
                }
                return acc
            }, [])

            break

        default:
            result = dates.map((x, i) => {
                return {
                    date: x,
                    index: r.startIndexCount + i + 1,
                }
            })
    }

    result = result.filter((y) => {
        let filterResult = false
        filterResult = y.date >= r.startRangePeriod

        if (r.count > 0 && y.index > r.count) {
            filterResult = false
        }
        return filterResult
    })

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
        case 'SECONDLY':
            //not implemented
            break
        case 'MINUTELY':
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
        case 'HOURLY':
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
        case 'DAILY':
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
        case 'WEEKLY':
            if (r.byDay.length > 1) {
                setWeeklyFirstEvent(r)
                result.firstEventInRangePeriod = r.firstEventInRangePeriod
                break
            }

            //if not byDay then the first event is dtStart

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
        case 'MONTHLY':
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
        case 'YEARLY':
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

    return result
}

const setWeeklyFirstEvent = (r: IRuleExtended) => {
    if (!r.byDay) return
    const weekDays = r.byDay?.split(',')
    if (weekDays.length === 0) return

    r.firstEventInRangePeriod = getStartOfWeekWithoutChangeTime(
        r.dtStart,
        r.wkst
    )

    const _dtStart = new Date(r.dtStart).getTime()

    let fDt = new Date(r.firstEventInRangePeriod)
    let count = 0

    while (true) {
        const t = addDays(fDt, count)
        ++count
        const weekDay = getWeekDayFromDate(t)
        if (t.getTime() >= _dtStart && weekDays.includes(weekDay)) {
            r.firstEventInRangePeriod = t
            break
        }
        if (count > 100) break
    }
}
