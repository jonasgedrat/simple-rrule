import { describe, it, expect } from 'vitest'
import { validateRrule, rRuleDefaultValues } from '../../src/validators/rRule'
import { Frequency } from '../../src/types'

describe('validateRrule', () => {
    it('should validate a valid rule correctly', () => {
        const rule = {
            ...rRuleDefaultValues,
            frequency: Frequency.DAILY,
            interval: 1,
            dtStart: new Date('2023-01-01T10:00:00.000Z'),
            dtEnd: new Date('2023-01-01T11:00:00.000Z')
        }
        
        const result = validateRrule(rule)
        
        expect(result.frequency).toBe(Frequency.DAILY)
    })

    it('should detect invalid interval values', () => {
        const rule = {
            ...rRuleDefaultValues,
            frequency: Frequency.DAILY,
            interval: -1, // Invalid interval
            dtStart: new Date('2023-01-01T10:00:00.000Z'),
            dtEnd: new Date('2023-01-01T11:00:00.000Z')
        }
        
        // O validador lança um erro em vez de retornar um objeto com hasErrors
        expect(() => validateRrule(rule)).toThrow()
    })

    it('should handle invalid date ranges', () => {
        const rule = {
            ...rRuleDefaultValues,
            frequency: Frequency.DAILY,
            interval: 1,
            dtStart: new Date('2023-01-02T10:00:00.000Z'),
            dtEnd: new Date('2023-01-01T11:00:00.000Z') // End before start
        }
        
        // O validador lança um erro em vez de retornar um objeto com hasErrors
        expect(() => validateRrule(rule)).toThrow()
    })
})