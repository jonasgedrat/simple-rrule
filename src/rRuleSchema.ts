import { IRrule } from './../dist/types.d'
import { addHours, addSeconds } from 'date-fns'
import * as Yup from 'yup'
import { InferType } from 'yup'
import { Frequency, Weekday } from './types'

const rRuleSchema = Yup.object({
    dtStart: Yup.date().default(new Date()).required(),
    dtEnd: Yup.date()
        .default(addHours(new Date(), 1))
        .min(Yup.ref('dtStart'))
        .when('dtStart', (dtStart, schema) => {
            if (dtStart) {
                return schema.min(addSeconds(dtStart, 15))
            }
            return schema
        }),

    frequency: Yup.mixed<Frequency>().default(Frequency.NEVER).required(),
    // .when('frequency', (frequency, schema) => {
    //     if (frequency === Frequency.NEVER) {
    //         return false
    //     }
    //     return schema
    // }),
    interval: Yup.number().min(1).default(1).positive().required(),
    count: Yup.number().min(0).default(0).required(),
    until: Yup.date(),

    byDay: Yup.string().default(''),
    byMonth: Yup.number().min(0).default(0).max(12).required(),
    byMonthDay: Yup.number().min(0).default(0).max(31).required(),
    bySetPos: Yup.number().min(-1).default(0).max(4).required(),

    weekStartOn: Yup.mixed<Weekday>().default(Weekday.Sunday),
})

declare type IRRuleSchema = InferType<typeof rRuleSchema>

const rRuleSchemaDefaultValues = rRuleSchema.cast({})

export const isValidRRule = async (rRule: IRrule) => {
    const rRuleTest: IRRuleSchema = {
        dtStart: rRule.dtStart,
        dtEnd: rRule.dtEnd,
        frequency: rRule.frequency,
        interval: rRule.interval,
        count: rRule.count || rRuleSchemaDefaultValues.count,
        until: rRule.until,
        byDay: rRule.byDay || rRuleSchemaDefaultValues.byDay,
        byMonth: rRule.byMonth || rRuleSchemaDefaultValues.byMonth,
        byMonthDay: rRule.byMonthDay || rRuleSchemaDefaultValues.byMonthDay,
        bySetPos: rRule.bySetPos || rRuleSchemaDefaultValues.bySetPos,
        weekStartOn: rRule.weekStartOn || rRuleSchemaDefaultValues.weekStartOn,
    }

    // const result = rRuleSchema.validateSync(rRuleTest)

    let result: { okResult: IRRuleSchema; errorMessages: any[] } = {
        okResult: rRuleSchemaDefaultValues,
        errorMessages: [],
    }

    try {
        result.okResult = await rRuleSchema.validate(rRuleTest)
    } catch (err: any) {
        result.errorMessages = err.errors.map((err: any) => err.key)
        throw [rRuleTest, result.errorMessages]
    }

    //console.log('isValidRRule', result)

    return true
}
