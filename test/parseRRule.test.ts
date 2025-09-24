import { describe, it, expect } from 'vitest'
import { getRRuleString } from '../src/getRrule'
import { parseRecurrenceFromString } from '../src/parseRrule'
import { toRRuleDateString } from '../src/dates'
import { IRrule, rRuleDefaultValues } from '../src/validators/rRule'

let d: IRrule = {
    ...rRuleDefaultValues,
    dtStart: new Date('2022-12-15T00:00:00.000Z'),
    dtEnd: new Date('2022-12-15T01:00:00.000Z'),
}

export const dtStart = `  DTSTART:${toRRuleDateString(d.dtStart)}\n\r
DTEND:${toRRuleDateString(d.dtEnd)}

\n

`

describe('parseRRule', () => {
    it(`parseRecurrenceFromString with poor rRule string`, () => {
        const s = `${dtStart}  RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221215T152030Z;WKST=SU     `

        const r = parseRecurrenceFromString(s, 'SU')
        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual('WEEKLY')
            expect(r.interval).toEqual(1)
            expect(r.dtStart).toEqual(d.dtStart)
            expect(r.until).toEqual(new Date('2022-12-15T15:20:30.000Z'))
        }
    })

    it(`parseRecurrenceFromString  RRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3;WKST=SU`, () => {
        const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;COUNT=3;WKST=SU`
        const r = parseRecurrenceFromString(s, 'SU')
        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual('WEEKLY')
            expect(r.interval).toEqual(1)
            expect(r.count).toEqual(3)
            expect(r.dtStart.toISOString()).toEqual('2022-11-01T13:30:45.000Z')
            expect(r.dtEnd.toISOString()).toEqual('2022-11-03T13:30:45.000Z')
            expect(r.wkst === 'SU')
        }
    })

    it(`parseRecurrenceFromString  RRULE:FREQ=DAILY;INTERVAL=99;COUNT=99;WKST=SU`, () => {
        const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;INTERVAL=99;COUNT=99;WKST=SU`
        const r = parseRecurrenceFromString(s, 'SU')

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.frequency).toEqual('DAILY')
            expect(r.interval).toEqual(99)
            expect(r.count).toEqual(99)
            expect(r.dtStart.toISOString()).toEqual('2022-11-01T13:30:45.000Z')
            expect(r.dtEnd.toISOString()).toEqual('2022-11-03T13:30:45.000Z')
            expect(r.wkst).toEqual('SU')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test1`, () => {
        const s = getRRuleString({
            ...rRuleDefaultValues,
            frequency: 'HOURLY',
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(0)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('HOURLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test2`, () => {
        const s = getRRuleString({
            ...rRuleDefaultValues,
            frequency: 'WEEKLY',
            byDay: 'MO,FR',
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(0)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('MO,FR')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('WEEKLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test3`, () => {
        const s = getRRuleString({
            ...rRuleDefaultValues,
            frequency: 'MONTHLY',
            bySetPos: 1,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(1)
            expect(r.byMonthDay).toEqual(0)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('MONTHLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test4`, () => {
        const s = getRRuleString({
            ...rRuleDefaultValues,
            frequency: 'MONTHLY',
            bySetPos: 1,
            byMonthDay: 2,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(1)
            expect(r.byMonthDay).toEqual(2)
            expect(r.byMonth).toEqual(0)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('MONTHLY')
        }
    })

    it(`getRRuleString AND parseRecurrenceFromString test5`, () => {
        const s = getRRuleString({
            ...rRuleDefaultValues,
            frequency: 'YEARLY',
            bySetPos: -1,
            byMonthDay: 12,
            byMonth: 3,
        })
        const r = parseRecurrenceFromString(s)

        expect(r).not.toBeUndefined()
        if (r) {
            expect(r.wkst).toEqual('SU')
            expect(r.bySetPos).toEqual(-1)
            expect(r.byMonthDay).toEqual(12)
            expect(r.byMonth).toEqual(3)
            expect(r.byDay).toEqual('')
            expect(r.count).toEqual(0)
            expect(r.interval).toEqual(1)
            expect(r.frequency).toEqual('YEARLY')
        }
    })

    // Casos de erro e validação
    describe('Casos de erro e validação', () => {
        it('deve retornar undefined para string vazia', () => {
            expect(parseRecurrenceFromString('')).toBeUndefined()
            expect(parseRecurrenceFromString('   ')).toBeUndefined()
            expect(parseRecurrenceFromString('\n\r\t')).toBeUndefined()
        })

        it('deve lançar erro para string sem RRULE', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z`
            expect(() => parseRecurrenceFromString(s)).toThrow()
        })

        it('deve retornar objeto com frequency NEVER quando frequency não está definida', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:INTERVAL=1;WKST=SU`
            const result = parseRecurrenceFromString(s)
            expect(result).toBeDefined()
            expect(result?.frequency).toBe('NEVER')
        })

        it('deve retornar objeto com valores padrão quando count e until estão ambos definidos', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;COUNT=5;UNTIL=20221215T152030Z`
            const result = parseRecurrenceFromString(s)
            // A função retorna objeto com valores padrão quando há conflito entre count e until
            expect(result).toBeDefined()
            expect(result?.frequency).toBe('NEVER')
            expect(result?.count).toBe(0)
            expect(result?.until).toBeUndefined()
        })

        it('deve lançar erro para datas inválidas (dtEnd antes de dtStart)', () => {
            const s = `DTSTART:20221103T133045Z\nDTEND:20221101T133045Z\nRRULE:FREQ=DAILY;INTERVAL=1`
            expect(() => parseRecurrenceFromString(s)).toThrow(
                'End date must be after start date'
            )
        })

        it('deve definir interval padrão quando interval=0', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;INTERVAL=0`
            const result = parseRecurrenceFromString(s)
            expect(result?.interval).toBe(1) // valor padrão quando interval é 0
        })

        it('deve lançar erro para count negativo', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;COUNT=-1`
            expect(() => parseRecurrenceFromString(s)).toThrow()
        })
    })

    // Strings RRule malformadas
    describe('Strings RRule malformadas', () => {
        it('deve lidar com espaços extras e quebras de linha', () => {
            const s = `  DTSTART:20221101T133045Z  \n\n  DTEND:20221103T133045Z  \n\r\n  RRULE:FREQ=DAILY;INTERVAL=1  `
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('DAILY')
                expect(r.interval).toEqual(1)
            }
        })

        it('deve ignorar campos desconhecidos', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;INTERVAL=1;UNKNOWN=VALUE;WKST=SU`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('DAILY')
                expect(r.interval).toEqual(1)
                expect(r.wkst).toEqual('SU')
            }
        })

        it('deve lidar com múltiplas barras verticais', () => {
            const s = `DTSTART:20221101T133045Z||\nDTEND:20221103T133045Z||\nRRULE:FREQ=DAILY||;INTERVAL=1`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('DAILY')
                expect(r.interval).toEqual(1)
            }
        })
    })

    // Todos os tipos de frequência
    describe('Todos os tipos de frequência', () => {
        it('deve parsear SECONDLY', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=SECONDLY;INTERVAL=30`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('SECONDLY')
                expect(r.interval).toEqual(30)
            }
        })

        it('deve parsear MINUTELY', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MINUTELY;INTERVAL=15`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('MINUTELY')
                expect(r.interval).toEqual(15)
            }
        })

        it('deve parsear HOURLY', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=HOURLY;INTERVAL=2`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('HOURLY')
                expect(r.interval).toEqual(2)
            }
        })

        it('deve parsear DAILY', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;INTERVAL=3`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('DAILY')
                expect(r.interval).toEqual(3)
            }
        })

        it('deve parsear WEEKLY com byDay', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;INTERVAL=2`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('WEEKLY')
                expect(r.byDay).toEqual('MO,WE,FR')
                expect(r.interval).toEqual(2)
            }
        })

        it('deve parsear MONTHLY com byMonthDay', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=15;INTERVAL=2`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('MONTHLY')
                expect(r.byMonthDay).toEqual(15)
                expect(r.interval).toEqual(2)
            }
        })

        it('deve parsear YEARLY com byMonth', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=YEARLY;BYMONTH=6;INTERVAL=2`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.frequency).toEqual('YEARLY')
                expect(r.byMonth).toEqual(6)
                expect(r.interval).toEqual(2)
            }
        })
    })

    // Validação de campos numéricos
    describe('Validação de campos numéricos', () => {
        it('deve ignorar byMonth fora do intervalo (1-12)', () => {
            const s1 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=YEARLY;BYMONTH=0`
            const s2 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=YEARLY;BYMONTH=13`

            const r1 = parseRecurrenceFromString(s1)
            const r2 = parseRecurrenceFromString(s2)

            expect(r1?.byMonth).toEqual(0) // valor padrão
            expect(r2?.byMonth).toEqual(0) // valor padrão
        })

        it('deve ignorar byMonthDay fora do intervalo (1-31)', () => {
            const s1 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=0`
            const s2 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=32`

            const r1 = parseRecurrenceFromString(s1)
            const r2 = parseRecurrenceFromString(s2)

            expect(r1?.byMonthDay).toEqual(0) // valor padrão
            expect(r2?.byMonthDay).toEqual(0) // valor padrão
        })

        it('deve aceitar bySetPos válidos (-1, 1-4)', () => {
            const testCases = [-1, 1, 2, 3, 4]

            testCases.forEach((pos) => {
                const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYSETPOS=${pos}`
                const r = parseRecurrenceFromString(s)
                expect(r?.bySetPos).toEqual(pos)
            })
        })

        it('deve lançar erro para bySetPos inválidos', () => {
            const s1 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYSETPOS=-2`
            const s2 = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=MONTHLY;BYSETPOS=5`

            expect(() => parseRecurrenceFromString(s1)).toThrow()
            expect(() => parseRecurrenceFromString(s2)).toThrow()
        })

        it('deve parsear strings numéricas corretamente', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=15`
            const r = parseRecurrenceFromString(s)
            expect(r?.byMonth).toEqual(6)
            expect(r?.byMonthDay).toEqual(15)
        })
    })

    // Casos extremos de datas
    describe('Casos extremos de datas', () => {
        it('deve parsear datas no formato correto', () => {
            const s = `DTSTART:20221231T235959Z\nDTEND:20230101T000059Z\nRRULE:FREQ=DAILY;INTERVAL=1`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.dtStart.toISOString()).toEqual(
                    '2022-12-31T23:59:59.000Z'
                )
                expect(r.dtEnd.toISOString()).toEqual(
                    '2023-01-01T00:00:59.000Z'
                )
            }
        })

        it('deve parsear until corretamente', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=DAILY;UNTIL=20221215T152030Z`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.until?.toISOString()).toEqual(
                    '2022-12-15T15:20:30.000Z'
                )
            }
        })

        it('deve definir dtEnd automaticamente quando não fornecido', () => {
            const s = `DTSTART:20221101T133045Z\nRRULE:FREQ=DAILY;INTERVAL=1`
            const r = parseRecurrenceFromString(s)
            expect(r).not.toBeUndefined()
            if (r) {
                expect(r.dtStart.toISOString()).toEqual(
                    '2022-11-01T13:30:45.000Z'
                )
                expect(r.dtEnd.toISOString()).toEqual(
                    '2022-11-01T14:30:45.000Z'
                ) // +1 hora
            }
        })

        it('deve usar weekStartsOn padrão quando wkst não está definido', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=WEEKLY;INTERVAL=1`
            const r = parseRecurrenceFromString(s, 'MO')
            expect(r?.wkst).toEqual('MO')
        })

        it('deve truncar wkst para 2 caracteres', () => {
            const s = `DTSTART:20221101T133045Z\nDTEND:20221103T133045Z\nRRULE:FREQ=WEEKLY;WKST=SUNDAY`
            const r = parseRecurrenceFromString(s)
            expect(r?.wkst).toEqual('SU')
        })
    })

    // Testes de integração com getRRuleString
    describe('Integração com getRRuleString', () => {
        it('deve fazer round-trip corretamente para regras complexas', () => {
            const original = {
                ...rRuleDefaultValues,
                frequency: 'MONTHLY' as const,
                bySetPos: -1,
                byMonthDay: 15,
                byDay: 'FR',
                interval: 2,
                count: 10,
                wkst: 'MO' as const,
            }

            const rRuleString = getRRuleString(original)
            const parsed = parseRecurrenceFromString(rRuleString)

            expect(parsed).not.toBeUndefined()
            if (parsed) {
                expect(parsed.frequency).toEqual(original.frequency)
                expect(parsed.bySetPos).toEqual(original.bySetPos)
                expect(parsed.byMonthDay).toEqual(original.byMonthDay)
                expect(parsed.byDay).toEqual(original.byDay)
                expect(parsed.interval).toEqual(original.interval)
                expect(parsed.count).toEqual(original.count)
                expect(parsed.wkst).toEqual(original.wkst)
            }
        })

        it('deve fazer round-trip para regra YEARLY com until', () => {
            const original = {
                ...rRuleDefaultValues,
                frequency: 'YEARLY' as const,
                byMonth: 12,
                until: new Date('2025-12-31T23:59:59.000Z'),
                interval: 1,
            }

            const rRuleString = getRRuleString(original)
            const parsed = parseRecurrenceFromString(rRuleString)

            expect(parsed).not.toBeUndefined()
            if (parsed) {
                expect(parsed.frequency).toEqual(original.frequency)
                expect(parsed.byMonth).toEqual(original.byMonth)
                expect(parsed.until?.toISOString()).toEqual(
                    original.until.toISOString()
                )
                expect(parsed.interval).toEqual(original.interval)
            }
        })
    })
})
