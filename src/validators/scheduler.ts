import * as Yup from 'yup'
import { addHours, addSeconds } from 'date-fns'
import { Frequency, Weekday } from '../types'

export const schedulerEditorValidator = Yup.object({
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

export declare type ISchedulerEditor = Yup.InferType<
    typeof schedulerEditorValidator
>

export const schedulerEditorDefaultValues = schedulerEditorValidator.cast({})
