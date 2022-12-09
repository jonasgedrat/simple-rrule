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
import { Frequency, IRrule, IRuleExtended } from './types'

export interface IDateEvents {
    date: Date
    index: number
}

export interface IExpandResult {
    r: IRuleExtended
    events: IDateEvents[]
}

export const expandRRule = (
    rRule: IRrule,
    startRangePeriod: Date,
    endRangePeriod: Date,
    minimalSecondsDuration: number = 60 * 5 //5 minutos
): IExpandResult => {
    //ajustar todas as datas para UTC time zone 000 antes de qualquer coisa

    //console.log(rRule)

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

    switch (r.frequency) {
        case Frequency.SECONDLY:
            //nao implementado
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
                //caso nao tenha nenhum dia sa semana selecionado
                //retorna evento semanal pelo dia da DTSTART
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
            console.log('yearly interval', interval)
            dates = eachYearOfInterval(interval)
            break
        default:
    }

    const result: IDateEvents[] = dates
        .map((x, i) => {
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

    //limitar se tiver until
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
            //nao implementado
            break
        case Frequency.MINUTELY:
            durationInFrequency = differenceInMinutes(
                //final do primeiro evento
                addDays(r.dtStart, r.interval),
                //inicio do primeiro evento
                r.dtStart
            )
            durationFromStart = differenceInMinutes(
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
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
                //final do primeiro evento
                addDays(r.dtStart, r.interval),
                //inicio do primeiro evento
                r.dtStart
            )
            durationFromStart = differenceInHours(
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
                r.dtStart
            )
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
                //final do primeiro evento
                addDays(r.dtStart, r.interval),
                //inicio do primeiro evento
                r.dtStart
            )
            durationFromStart = differenceInDays(
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
                r.dtStart
            )
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
                //final do primeiro evento
                addDays(r.dtStart, r.interval * 7),
                //inicio do primeiro evento
                r.dtStart
            )
            durationFromStart = differenceInWeeks(
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
                r.dtStart
            )

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
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
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
                //data inicial do scheduler
                r.startRangePeriod,
                //inicio do primeiro evento
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

    //count inicial dos eventos
    result.startIndexCount = eventCountsFromDtStart

    // console.log('result', result)
    return result
}
