import * as Yup from 'yup'
import { addHours, addSeconds } from '../dates'
import { Frequency, Weekday } from '../types'

const schedulerEditorValidator = Yup.object({
    id: Yup.string().required().default('0'),
    title: Yup.string().min(2).default('--').required(),
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
    eventBackgroundColor: Yup.string(),

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

interface ISchedulerEditor
    extends Yup.InferType<typeof schedulerEditorValidator> {}

const schedulerEditorDefaultValues: ISchedulerEditor =
    schedulerEditorValidator.cast({})

const validateSchedulerEditor = (
    schedulerEditor: ISchedulerEditor
): ISchedulerEditor => {
    try {
        schedulerEditorValidator.validateSync(schedulerEditor)
        return schedulerEditor
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
    schedulerEditorValidator,
    schedulerEditorDefaultValues,
    validateSchedulerEditor,
}

export type { ISchedulerEditor }
