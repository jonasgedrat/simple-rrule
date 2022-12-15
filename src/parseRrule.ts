import { parseISO } from 'date-fns'
import { trim } from 'lodash'
import { isBetween } from './numbers'

import { Frequency, IRrule, rRuleDefault, rRuleFields, Weekday } from './types'

export const parseRecurrenceFromString = (
    recurrenceString: string = '',
    weekStartsOn: Weekday
): IRrule | undefined => {
    if (trim(recurrenceString) === '') return undefined

    const lines = recurrenceString.split('\n')

    let result: IRrule = rRuleDefault

    lines.map((line) => {
        const lineKey = trim(line.split(':')[0])
        const lineValue = trim(line.split(':')[1])

        if (lineKey === rRuleFields.dtStart) {
            const dtStart = parseISO(lineValue)
            if (dtStart) {
                result.dtStart = dtStart
            }
        }

        if (lineKey === rRuleFields.dtEnd) {
            const dtEnd = parseISO(lineValue)
            if (dtEnd) {
                result.dtEnd = dtEnd
            }
        }

        if (lineKey === rRuleFields.RRule) {
            const _parseRRule = parseRRule(line, weekStartsOn)
            result = { ...result, ..._parseRRule }
        }
        return true
    })

    return result
}

const parseRRule = (rRuleString: string = '', weekStartsOn: Weekday) => {
    if (rRuleString === '') return undefined

    const fields = rRuleString.split(':')[1].split(';')

    let result: Partial<IRrule> = {}
    let _v: number | undefined = undefined

    fields.map((field) => {
        const value = trim(field.split('=')[1])

        switch (field.split('=')[0]) {
            case rRuleFields.frequency:
                result.frequency = value as Frequency
                break
            case rRuleFields.weekStartOn:
                result.weekStartOn = value ? (value as Weekday) : weekStartsOn
                break
            case rRuleFields.interval:
                result.interval = parseInt(value)
                break
            case rRuleFields.count:
                result.count = parseInt(value)
                break
            case rRuleFields.until:
                result.until = parseISO(value)
                break
            case rRuleFields.byMinute:
                _v = isBetween(value, 0, 59)
                if (_v) {
                    result.byMinute = _v
                }
                _v = undefined
                break
            case rRuleFields.byHour:
                _v = isBetween(value, 0, 23)
                if (_v) {
                    result.byHour = _v
                }
                _v = undefined
                break
            case rRuleFields.byDay:
                result.byDay = value
                _v = undefined
                break
            case rRuleFields.byMonthDay:
                _v = isBetween(value, 1, 31)
                if (_v) {
                    result.byMonthDay = _v
                }
                _v = undefined
                break
            case rRuleFields.byYearDay:
                _v = isBetween(value, 1, 365)
                if (_v) {
                    result.byYearDay = _v
                }
                _v = undefined
                break
            case rRuleFields.byMonth:
                _v = isBetween(value, 1, 12)
                if (_v) {
                    result.byMonth = _v
                }
                _v = undefined
                break
            case rRuleFields.bySetPos:
                _v = isBetween(value, 1, 365)
                if (_v) {
                    result.bySetPos = _v
                }
                _v = undefined
                break

            default:
                break
        }

        return null
    })

    if (
        result.frequency === undefined ||
        (result.count !== undefined && result.until)
    ) {
        return undefined
    }

    if (result.weekStartOn === undefined) {
        result.weekStartOn = weekStartsOn
    }

    if (!result.interval) {
        result.interval = 1
    }

    return result
}
