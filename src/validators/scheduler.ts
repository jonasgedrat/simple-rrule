import * as yup from 'yup'
import { addHours } from '../dates'
import { Frequency, Weekday } from '../types'

const schedulerEditorValidator = yup.object({
    id: yup.string().required().default('0'),
    title: yup.string().min(2).default('--').required(),
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
    eventBackgroundColor: yup.string(),

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

interface ISchedulerEditor {
    id: string
    title: string
    dtStart: Date
    dtEnd: Date
    eventBackgroundColor?: string
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

const schedulerEditorDefaultValues: ISchedulerEditor =
    schedulerEditorValidator.cast({}) as ISchedulerEditor

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
