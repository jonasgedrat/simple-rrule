import * as z from 'zod'
import { rRuleSchema, rRuleDefaultValues } from './rRule'

const schedulerEditorSchema = rRuleSchema.extend({
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
): ISchedulerEditor | z.ZodError => {
    const result = schedulerEditorSchema.safeParse(schedulerEditor)
    if (!result.success) {
        return result.error
    }
    return result.data
}

export {
    schedulerEditorSchema,
    schedulerEditorDefaultValues,
    validateSchedulerEditor,
}

export type { ISchedulerEditor }
