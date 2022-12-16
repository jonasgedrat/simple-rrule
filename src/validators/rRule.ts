import { addHours, addSeconds } from 'date-fns'
import * as Yup from 'yup'
import { Frequency, Weekday } from '../types'

export const rRuleValidator = Yup.object({
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

// export declare type IRrule = Yup.InferType<typeof rRuleValidator>

export const rRuleDefaultValues = rRuleValidator.cast({})

export interface IRrule {
    dtStart: Date
    dtEnd: Date

    frequency: Frequency
    interval: number
    count: number
    until?: Date

    byDay?: string
    byMonth?: number
    byMonthDay?: number
    bySetPos?: number

    wkst: Weekday
}

export interface IRuleExtended extends IRrule {
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
