import * as z from 'zod'
import { rRuleSchema, rRuleDefaultValues } from './rRule'

const schedulerEditorSchema = rRuleSchema.safeExtend({
    id: z.string(),
    title: z.string().min(2),
    eventBackgroundColor: z.string().optional(),
})

type ISchedulerEditor = z.infer<typeof schedulerEditorSchema>

const schedulerEditorDefaultValues: ISchedulerEditor = {
    ...rRuleDefaultValues,
    id: '0',
    title: '--',
}

const validateSchedulerEditor = (
    schedulerEditor: ISchedulerEditor
): ISchedulerEditor => {
    const result = schedulerEditorSchema.safeParse(schedulerEditor)
    if (!result.success) {
        throw result.error
    }
    return result.data
}

export {
    schedulerEditorSchema,
    schedulerEditorDefaultValues,
    validateSchedulerEditor,
}

export type { ISchedulerEditor }
