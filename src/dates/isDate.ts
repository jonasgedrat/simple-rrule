/**
 * Verifica se um valor é uma data válida
 *
 * @param value - Valor a ser verificado
 * @returns true se o valor for uma instância de Date válida, false caso contrário
 *
 * @example
 * isDate(new Date()) // true
 * isDate(new Date('2024-01-15')) // true
 * isDate(new Date('invalid')) // false
 * isDate('2024-01-15') // false
 * isDate(null) // false
 * isDate(undefined) // false
 *
 */

export const isDate = (value: unknown): value is Date => {
    return value instanceof Date && !Number.isNaN(value.getTime())
}
