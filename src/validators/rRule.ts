import * as z from 'zod'
import { addHours } from '../dates'
import { Frequency, Weekday } from '../types'

const rRuleSchema = z
    .object({
        dtStart: z.date().default(() => new Date()),
        dtEnd: z.date().default(() => addHours(new Date(), 1)),

        frequency: z.enum(Frequency).default(Frequency.NEVER),
        interval: z.number().min(1).default(1),
        count: z.number().min(0).default(0),
        until: z.date().optional(),

        byDay: z.string().default(''),
        byMonth: z.number().min(0).max(12).default(0),
        byMonthDay: z.number().min(0).max(31).default(0),
        bySetPos: z.number().min(-1).max(4).default(0),

        wkst: z.nativeEnum(Weekday).default(Weekday.Sunday),
    })
    .refine(
        (data) => {
            return !data.dtStart || !data.dtEnd || data.dtEnd >= data.dtStart
        },
        {
            message: 'End date must be after start date',
            path: ['dtEnd'],
        }
    )

type IRrule = z.infer<typeof rRuleSchema>

const rRuleDefaultValues: IRrule = rRuleSchema.parse({})

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
        return rRuleSchema.parse(rRule)
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

export { rRuleSchema, rRuleDefaultValues, validateRrule }

export type { IRrule, IRuleExtended }
