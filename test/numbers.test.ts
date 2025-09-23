import { describe, it, expect } from 'vitest'
import { isBetween } from '../src/numbers'

describe('isBetween', () => {
    describe('Valores dentro do intervalo', () => {
        it('deve retornar o número quando está dentro do intervalo', () => {
            expect(isBetween(5, 1, 10)).toBe(5)
            expect(isBetween('5', 1, 10)).toBe(5)
            expect(isBetween(7.5, 1, 10)).toBe(7.5)
        })

        it('deve retornar o número quando está nos limites do intervalo', () => {
            expect(isBetween(1, 1, 10)).toBe(1)
            expect(isBetween(10, 1, 10)).toBe(10)
            expect(isBetween('1', 1, 10)).toBe(1)
            expect(isBetween('10', 1, 10)).toBe(10)
        })

        it('deve funcionar com intervalos negativos', () => {
            expect(isBetween(-5, -10, -1)).toBe(-5)
            expect(isBetween('-5', -10, -1)).toBe(-5)
            expect(isBetween(-10, -10, -1)).toBe(-10)
            expect(isBetween(-1, -10, -1)).toBe(-1)
        })

        it('deve funcionar com intervalos que incluem zero', () => {
            expect(isBetween(0, -5, 5)).toBe(0)
            expect(isBetween('0', -5, 5)).toBe(0)
            expect(isBetween(-3, -5, 5)).toBe(-3)
            expect(isBetween(3, -5, 5)).toBe(3)
        })
    })

    describe('Valores fora do intervalo', () => {
        it('deve retornar undefined quando o valor está abaixo do limite inferior', () => {
            expect(isBetween(0, 1, 10)).toBeUndefined()
            expect(isBetween('0', 1, 10)).toBeUndefined()
            expect(isBetween(-5, 1, 10)).toBeUndefined()
        })

        it('deve retornar undefined quando o valor está acima do limite superior', () => {
            expect(isBetween(11, 1, 10)).toBeUndefined()
            expect(isBetween('15', 1, 10)).toBeUndefined()
            expect(isBetween(100, 1, 10)).toBeUndefined()
        })

        it('deve retornar undefined para valores negativos fora do intervalo', () => {
            expect(isBetween(-15, -10, -1)).toBeUndefined()
            expect(isBetween(0, -10, -1)).toBeUndefined()
            expect(isBetween('-15', -10, -1)).toBeUndefined()
        })
    })

    describe('Casos extremos', () => {
        it('deve lidar com strings numéricas válidas', () => {
            expect(isBetween('5.5', 1, 10)).toBe(5.5)
            expect(isBetween('1.0', 1, 10)).toBe(1)
            expect(isBetween('10.0', 1, 10)).toBe(10)
        })

        it('deve retornar undefined para strings não numéricas', () => {
            expect(isBetween('abc', 1, 10)).toBeUndefined()
            expect(isBetween('', 1, 10)).toBeUndefined()
            expect(isBetween('5a', 1, 10)).toBeUndefined()
        })

        it('deve lidar com números decimais', () => {
            expect(isBetween(1.5, 1, 2)).toBe(1.5)
            expect(isBetween(0.5, 0, 1)).toBe(0.5)
            expect(isBetween(2.1, 1, 2)).toBeUndefined()
        })

        it('deve funcionar quando start e end são iguais', () => {
            expect(isBetween(5, 5, 5)).toBe(5)
            expect(isBetween('5', 5, 5)).toBe(5)
            expect(isBetween(4, 5, 5)).toBeUndefined()
            expect(isBetween(6, 5, 5)).toBeUndefined()
        })

        it('deve lidar com valores especiais', () => {
            expect(isBetween(0, 0, 0)).toBe(0)
            expect(isBetween('0', 0, 0)).toBe(0)
            expect(isBetween(-0, 0, 0)).toBe(-0)
        })

        it('deve funcionar com intervalos onde start > end', () => {
            // A função usa (_v - start) * (_v - end) <= 0
            // Isso significa que funciona independente da ordem de start/end
            expect(isBetween(5, 10, 1)).toBe(5)
            expect(isBetween(0, 10, 1)).toBeUndefined()
            expect(isBetween(11, 10, 1)).toBeUndefined()
        })

        it('deve retornar undefined para valores infinitos', () => {
            expect(isBetween(Infinity, 1, 10)).toBeUndefined()
            expect(isBetween(-Infinity, 1, 10)).toBeUndefined()
        })

        it('deve retornar undefined para NaN', () => {
            expect(isBetween(NaN, 1, 10)).toBeUndefined()
            expect(isBetween('NaN', 1, 10)).toBeUndefined()
        })
    })

    describe('Casos de uso real', () => {
        it('deve validar meses (1-12)', () => {
            expect(isBetween(1, 1, 12)).toBe(1)
            expect(isBetween(6, 1, 12)).toBe(6)
            expect(isBetween(12, 1, 12)).toBe(12)
            expect(isBetween(0, 1, 12)).toBeUndefined()
            expect(isBetween(13, 1, 12)).toBeUndefined()
        })

        it('deve validar dias do mês (1-31)', () => {
            expect(isBetween(1, 1, 31)).toBe(1)
            expect(isBetween(15, 1, 31)).toBe(15)
            expect(isBetween(31, 1, 31)).toBe(31)
            expect(isBetween(0, 1, 31)).toBeUndefined()
            expect(isBetween(32, 1, 31)).toBeUndefined()
        })

        it('deve validar percentuais (0-100)', () => {
            expect(isBetween(0, 0, 100)).toBe(0)
            expect(isBetween(50, 0, 100)).toBe(50)
            expect(isBetween(100, 0, 100)).toBe(100)
            expect(isBetween(-1, 0, 100)).toBeUndefined()
            expect(isBetween(101, 0, 100)).toBeUndefined()
        })
    })
})