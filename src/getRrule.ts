import { toRRuleDateString } from './rRuleDateStringFormat'

import { rRuleFields, Frequency } from './types'
import { ISchedulerEditor } from './validators/scheduler'
import { schemaValidatorSync } from './validators/schemaValidator'

export const getRRuleString = (payload: ISchedulerEditor) => {
    if (payload.frequency === Frequency.NEVER) {
        return ''
    }

    const f = schemaValidatorSync('schedulerEditor', payload)

    let rRuleString = `${rRuleFields.frequency}=${f.frequency.toUpperCase()}`
    const start = `${rRuleFields.dtStart}:${toRRuleDateString(f.dtStart)}`
    const end = `${rRuleFields.dtEnd}:${toRRuleDateString(f.dtEnd)}\n`
    rRuleString += `;${rRuleFields.interval}=${f.interval || 1}`

    if (f.count > 0) {
        rRuleString += `;${rRuleFields.count}=${f.count}`
    }

    if (f.until) {
        rRuleString += `;${rRuleFields.until}=${toRRuleDateString(f.until)}`
    }

    if (f.frequency === Frequency.YEARLY && f.byMonth > 0) {
        rRuleString += `;${rRuleFields.byMonth}=${f.byMonth}`
    }

    if (f.frequency === Frequency.MONTHLY && f.byMonthDay > 0) {
        rRuleString += `;${rRuleFields.byMonthDay}=${f.byMonthDay}`
    }

    if (f.bySetPos !== 0) {
        rRuleString += `;${rRuleFields.bySetPos}=${f.bySetPos}`
    }

    if (f.byDay !== '') {
        rRuleString += `;${rRuleFields.byDay}=${f.byDay}`
    }

    if (f.wkst) {
        rRuleString += `;${rRuleFields.wkst}=${f.wkst}`
    }

    rRuleString = `${start}\n${end}${rRuleFields.RRule}:${rRuleString}`

    return rRuleString
}
