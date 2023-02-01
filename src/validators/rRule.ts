import * as Yup from 'yup'
import { addHours, addSeconds } from '../dates'
import { Frequency, Weekday } from '../types'

const rRuleValidator = Yup.object({
    dtStart: Yup.date().default(new Date()).required(),
    dtEnd: Yup.date()
        .default(addHours(new Date(), 1))
        .min(Yup.ref('dtStart'))
        .when('dtStart', (dtStart: Date, schema: Yup.DateSchema<Date>) => {
            if (dtStart) {
                return schema.min(addSeconds(dtStart, 15))
            }
            return schema
        }),

    frequency: Yup.mixed<Frequency>().default(Frequency.NEVER).required(),
    interval: Yup.number().min(1).default(1).positive().required(),
    count: Yup.number().min(0).default(0).required(),
    until: Yup.date(),

    byDay: Yup.string().default(''),
    byMonth: Yup.number().min(0).default(0).max(12).required(),
    byMonthDay: Yup.number().min(0).default(0).max(31).required(),
    bySetPos: Yup.number().min(-1).default(0).max(4).required(),

    wkst: Yup.mixed<Weekday>().default(Weekday.Sunday),
})

interface IRrule extends Yup.InferType<typeof rRuleValidator> {}

const rRuleDefaultValues: IRrule = rRuleValidator.cast({})

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
