import * as z from 'zod'
import { addHours } from '../dates'
import { FrequencyValuesList, WeekdayValuesList } from '../types'
import isDate from '../dates/isDate'

const rRuleSchema = z
    .object({
        dtStart: z.iso.datetime(),
        dtEnd: z.iso.datetime(),
        frequency: z.enum(FrequencyValuesList),
        interval: z.number().min(1),
        count: z.number().min(0),
        until: z.iso.datetime().optional(),
        byDay: z.string(),
        byMonth: z.number().min(0).max(12),
        byMonthDay: z.number().min(0).max(31),
        bySetPos: z.number().min(-1).max(4),
        wkst: z.enum(WeekdayValuesList),
    })
    .refine(
        (data) => {
            const _dtStart = new Date(data.dtStart)
            const _dtEnd = new Date(data.dtEnd)

            return (
                !isDate(_dtStart) ||
                !isDate(_dtEnd) ||
                _dtEnd.getTime() >= _dtStart.getTime()
            )
        },
        {
            message: 'End date must be after start date',
            path: ['dtEnd'],
        }
    )

// .refine(
//     (data) => {
//         return !data.dtStart || !data.dtEnd || data.dtEnd >= data.dtStart
//     },
//     {
//         message: 'End date must be after start date',
//         path: ['dtEnd'],
//     }
// )

type IRrule = z.infer<typeof rRuleSchema>

const rRuleDefaultValues: IRrule = {
    dtStart: new Date().toISOString(),
    dtEnd: addHours(new Date(), 1).toISOString(),
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
