import * as z from 'zod'
import { addHours } from '../dates'
import { Frequency, Weekday } from '../types'

const schedulerEditorSchema = z
    .object({
        id: z.string().default('0'),
        title: z.string().min(2).default('--'),
        dtStart: z.date().default(() => new Date()),
        dtEnd: z.date().default(() => addHours(new Date(), 1)),
        eventBackgroundColor: z.string().optional(),

        frequency: z.enum(Frequency).default(Frequency.NEVER),
        interval: z.number().min(1).default(1),
        count: z.number().min(0).default(0),
        until: z.date().optional(),

        byDay: z.string().default(''),
        byMonth: z.number().min(0).max(12).default(0),
        byMonthDay: z.number().min(0).max(31).default(0),
        bySetPos: z.number().min(-1).max(4).default(0),

        wkst: z.enum(Weekday).default(Weekday.Sunday),
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

type ISchedulerEditor = z.infer<typeof schedulerEditorSchema>

const schedulerEditorDefaultValues: ISchedulerEditor =
    schedulerEditorSchema.parse({})

const validateSchedulerEditor = (
    schedulerEditor: ISchedulerEditor
): ISchedulerEditor => {
    try {
        return schedulerEditorSchema.parse(schedulerEditor)
    } catch (err) {
        console.error(
            `\nValidation error on schedulerEditor schema`,
            schedulerEditor,
            err,
            '\n'
        )
        const error = {
            err: 'E_MALFORMED_BODY',
            stack: (err as Error).message,
            status: 400,
        }
        throw error
    }
}

export {
    schedulerEditorSchema,
    schedulerEditorDefaultValues,
    validateSchedulerEditor,
}

export type { ISchedulerEditor }
