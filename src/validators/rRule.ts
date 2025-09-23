import * as z from 'zod'
import { addHours } from '../dates'
import { Frequency, Weekday } from '../types'

const rRuleSchema = z
    .object({
        dtStart: z.date(),
        dtEnd: z.date(),
        frequency: z.string<Frequency>(),
        interval: z.number().min(1),
        count: z.number().min(0),
        until: z.date().optional(),
        byDay: z.string(),
        byMonth: z.number().min(0).max(12),
        byMonthDay: z.number().min(0).max(31),
        bySetPos: z.number().min(-1).max(4),
        wkst: z.string<Weekday>(),
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

const rRuleDefaultValues: IRrule = {
    dtStart: new Date(),
    dtEnd: addHours(new Date(), 1),
    frequency: 'NEVER',
    interval: 1,
    count: 0,
    byDay: '',
    byMonth: 0,
    byMonthDay: 0,
    bySetPos: 0,
    wkst: 'SU',
}

interface IRuleExtended extends IRrule {
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
    const result = rRuleSchema.safeParse(rRule)
    if (!result.success) {
        throw result.error
    }
    return result.data
}

export { rRuleSchema, rRuleDefaultValues, validateRrule }

export type { IRrule, IRuleExtended }
