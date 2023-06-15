import { isBySetPosValid } from './validators/util'
import { isBetween } from './numbers'

import { Frequency, rRuleFields, Weekday } from './types'
import { IRrule, rRuleDefaultValues, validateRrule } from './validators/rRule'
import { addHours, fromRruleDateStringToDate } from './dates'

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

    if (rRule.frequency.toString() === 'DAILY||') {
        rRule.frequency === Frequency.DAILY
    }

    const result = validateRrule(rRule)

    return result
}

const parseRRule = (fields: string[] = [], weekStartsOn: Weekday) => {
    let result: Partial<IRrule> = {}
    let _v: number | undefined = undefined

    fields.map((field) => {
        const fieldValue = field.split('=')[1]
        const fieldKey = field.split('=')[0]

        switch (fieldKey) {
            case rRuleFields.frequency:
                if (fieldValue.includes('||')) {
                    console.log()
                }

                result.frequency = fieldValue as Frequency
                break
            case rRuleFields.wkst:
                result.wkst = fieldValue
                    ? (fieldValue.substring(0, 2) as Weekday)
                    : weekStartsOn
                break
            case rRuleFields.interval:
                result.interval = parseInt(fieldValue)
                break
            case rRuleFields.count:
                result.count = parseInt(fieldValue)
                break
            case rRuleFields.until:
                result.until = fromRruleDateStringToDate(fieldValue)
                break

            case rRuleFields.byDay:
                result.byDay = fieldValue
                _v = undefined
                break
            case rRuleFields.byMonthDay:
                _v = isBetween(fieldValue, 1, 31)
                if (_v) {
                    result.byMonthDay = _v
                }
                _v = undefined
                break
            case rRuleFields.byMonth:
                _v = isBetween(fieldValue, 1, 12)
                if (_v) {
                    result.byMonth = _v
                }
                _v = undefined
                break
            case rRuleFields.bySetPos:
                _v = Number(fieldValue)
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
