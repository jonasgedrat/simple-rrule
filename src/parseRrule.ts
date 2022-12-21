import { addHours, parseISO } from 'date-fns'
import { isBetween } from './numbers'

import { Frequency, rRuleFields, Weekday } from './types'
import { IRrule, rRuleDefaultValues, validateRrule } from './validators/rRule'

export const parseRecurrenceFromString = (
    recurrenceString: string = '',
    weekStartsOn: Weekday = Weekday.Sunday
): IRrule | undefined => {
    if (recurrenceString.trim() === '') return undefined

    const lines = recurrenceString.split('\n')

    let rRule: IRrule = rRuleDefaultValues

    lines.map((line) => {
        const lineKey = line.split(':')[0].trim()
        const lineValue = line.split(':')[1].trim()

        if (lineKey === rRuleFields.dtStart) {
            const dtStart = parseISO(lineValue)
            if (dtStart) {
                rRule.dtStart = dtStart
                //1 hour for duration by default
                rRule.dtEnd = addHours(dtStart, 1)
            }
        }

        if (lineKey === rRuleFields.dtEnd) {
            const dtEnd = parseISO(lineValue)
            if (dtEnd) {
                rRule.dtEnd = dtEnd
            }
        }

        if (lineKey === rRuleFields.RRule) {
            const _parseRRule = parseRRule(line, weekStartsOn)
            rRule = { ...rRule, ..._parseRRule }
        }

        return true
    })

    const result = validateRrule(rRule)

    return result
}

const parseRRule = (rRuleString: string = '', weekStartsOn: Weekday) => {
    if (rRuleString === '') return undefined

    const fields = rRuleString.split(':')[1].split(';')

    let result: Partial<IRrule> = {}
    let _v: number | undefined = undefined

    fields.map((field) => {
        const value = field.split('=')[1].trim()

        switch (field.split('=')[0]) {
            case rRuleFields.frequency:
                result.frequency = value as Frequency
                break
            case rRuleFields.wkst:
                result.wkst = value ? (value as Weekday) : weekStartsOn
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
            case rRuleFields.byMonth:
                _v = isBetween(value, 1, 12)
                if (_v) {
                    result.byMonth = _v
                }
                _v = undefined
                break
            case rRuleFields.bySetPos:
                _v = Number(value)
                if ([-1, 1, 2, 3, 4].includes(_v)) {
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

    if (result.wkst === undefined) {
        result.wkst = weekStartsOn
    }

    if (!result.interval) {
        result.interval = 1
    }

    return result
}
