import { isBySetPosValid } from './validators/util'
import { addHours, parseISO } from 'date-fns'
import { isBetween } from './numbers'

import { Frequency, rRuleFields, Weekday } from './types'
import { IRrule, rRuleDefaultValues, validateRrule } from './validators/rRule'
import { fromRruleDateStringToDate } from './rRuleDateStringFormat'

export const parseRecurrenceFromString = (
    recurrenceString: string = '',
    weekStartsOn: Weekday = Weekday.Sunday
): IRrule | undefined => {
    if (recurrenceString.trim() === '') return undefined
    if (recurrenceString.replaceAll(/\s/g, '') === '') return undefined

    const str2 = recurrenceString.replace(/\n|\r/g, '|').replaceAll(/\s/g, '')

    const lines = str2.split('RRULE:')

    const rRulePartsArray = lines[1].split(';').filter((x) => x !== '') //'FREQ=WEEKLY', 'INTERVAL=1', 'UNTIL=20221215T152030Z', 'WKST=SU'

    const lines2 = lines[0].split('|').filter((x) => x !== '') //'DTSTART:20221215T000000Z', 'DTEND:20221215T010000Z'

    // console.log(lines[1], lines2, rRulePartsArray)

    let rRule: IRrule = rRuleDefaultValues

    lines2.map((line) => {
        const lineKey = line.split(':')[0]
        const lineValue = line.split(':')[1]

        if (lineKey === rRuleFields.dtStart) {
            const dtStart = fromRruleDateStringToDate(lineValue)
            if (dtStart) {
                rRule.dtStart = dtStart
                //1 hour for duration by default
                rRule.dtEnd = addHours(dtStart, 1)
            }
        }

        if (lineKey === rRuleFields.dtEnd) {
            const dtEnd = fromRruleDateStringToDate(lineValue)
            if (dtEnd) {
                rRule.dtEnd = dtEnd
            }
        }

        return true
    })

    const _parseRRule = parseRRule(rRulePartsArray, weekStartsOn)
    rRule = { ...rRule, ..._parseRRule }

    const result = validateRrule(rRule)

    return result
}

const parseRRule = (fields: string[] = [], weekStartsOn: Weekday) => {
    let result: Partial<IRrule> = {}
    let _v: number | undefined = undefined

    fields.map((field) => {
        const value = field.split('=')[1]

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
                if (isBySetPosValid(_v)) {
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
