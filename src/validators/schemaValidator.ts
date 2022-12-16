import * as Yup from 'yup'
import { rRuleValidator } from './rRule'
import { schedulerEditorValidator } from './scheduler'

const VALIDATORS = {
    schedulerEditor: schedulerEditorValidator,
    rRule: rRuleValidator,
}

type ValidateBodySchemaParam = keyof typeof VALIDATORS

type SchemaType<T> = T extends 'schedulerEditor'
    ? Yup.InferType<typeof VALIDATORS['schedulerEditor']>
    : T extends 'rRule'
    ? Yup.InferType<typeof VALIDATORS['rRule']>
    : never

export function schemaValidatorSync<T extends ValidateBodySchemaParam>(
    schema: T,
    body: Record<string, unknown>
): SchemaType<T> {
    try {
        VALIDATORS[schema].validateSync(body)
        return body as SchemaType<T>
    } catch (err) {
        console.error(`\nValidation error on ${schema} schema`, body, err, '\n')
        const error = {
            err: 'E_MALFORMED_BODY',
            stack: (err as Error).message,
            status: 400,
        }
        throw error
    }
}

