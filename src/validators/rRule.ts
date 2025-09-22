import * as yup from 'yup'
import { addHours } from '../dates'
import { Frequency, Weekday } from '../types'

const rRuleValidator = yup.object({
    dtStart: yup.date().default(new Date()).required(),
    dtEnd: yup
        .date()
        .default(addHours(new Date(), 1))
        .min(yup.ref('dtStart'))
        .when('dtStart', {
            is: (dtStart: Date) => !!dtStart,
            then: (schema) => schema.min(yup.ref('dtStart')),
            otherwise: (schema) => schema,
        }),

    frequency: yup.mixed<Frequency>().default(Frequency.NEVER).required(),
    interval: yup.number().min(1).default(1).positive().required(),
    count: yup.number().min(0).default(0).required(),
    until: yup.date(),

    byDay: yup.string().default(''),
    byMonth: yup.number().min(0).default(0).max(12).required(),
    byMonthDay: yup.number().min(0).default(0).max(31).required(),
    bySetPos: yup.number().min(-1).default(0).max(4).required(),

    wkst: yup.mixed<Weekday>().default(Weekday.Sunday),
})

interface IRrule {
    dtStart: Date
    dtEnd: Date
    frequency: Frequency
    interval: number
    count: number
    until?: Date
    byDay: string
    byMonth: number
    byMonthDay: number
    bySetPos: number
    wkst: Weekday
}

const rRuleDefaultValues: IRrule = rRuleValidator.cast({}) as IRrule

interface IRuleExtended extends IRrule {
    count: number
    startRangePeriod: Date
    endRangePeriodOrUntil: Date
    secondsDuration: number
    hasErrors: boolean
    errorMessages: string
    eventsCount: number
    startIndexCount: number
    firstEventInRangePeriod: Date
}

const validateRrule = (rRule: IRrule): IRrule => {
    try {
        rRuleValidator.validateSync(rRule)
        return rRule
    } catch (err) {
        console.error(`\nValidation error on rRule schema`, rRule, err, '\n')
        const error = {
            err: 'E_MALFORMED_BODY',
            stack: (err as Error).message,
            status: 400,
        }
        throw error
    }
}

export { rRuleValidator, rRuleDefaultValues, validateRrule }

export type { IRrule, IRuleExtended }
