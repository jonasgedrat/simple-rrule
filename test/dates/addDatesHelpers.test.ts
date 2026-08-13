import { describe, it, expect } from 'vitest'

import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  setDayOfMonthClamped,
} from '../../src/dates'

const _d = new Date('2020-01-01T00:00:00.000Z')

describe('addDatesHelpers', () => {
  it('addDays', () => {
    expect(addDays(_d, 7)).toEqual(new Date('2020-01-08T00:00:00.000Z'))
  })
  it('addHours', () => {
    expect(addHours(_d, 7)).toEqual(new Date('2020-01-01T07:00:00.000Z'))
  })
  it('addMinutes', () => {
    expect(addMinutes(_d, 7)).toEqual(new Date('2020-01-01T00:07:00.000Z'))
  })
  it('addMonths', () => {
    expect(addMonths(_d, 7)).toEqual(new Date('2020-08-01T00:00:00.000Z'))
  })
  it('addSeconds', () => {
    expect(addSeconds(_d, 7)).toEqual(new Date('2020-01-01T00:00:07.000Z'))
  })
  it('addYears', () => {
    expect(addYears(_d, 7)).toEqual(new Date('2027-01-01T00:00:00.000Z'))
  })
})

describe('setDayOfMonthClamped', () => {
  const _d = (iso: string) => new Date(iso)

  it('deve definir dia corretamente quando o dia existe no mês', () => {
    const date = _d('2023-01-15T12:34:56.123Z')
    const result = setDayOfMonthClamped(date, 10)
    expect(result).toEqual(_d('2023-01-10T12:34:56.123Z'))
  })

  it('deve clampar dia 31 para fevereiro (ano comum, 28 dias) - sem rollover', () => {
    const date = _d('2023-02-01T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result).toEqual(_d('2023-02-28T10:00:00.000Z'))
  })

  it('deve clampar dia 30 para fevereiro (ano comum, 28 dias) - sem rollover', () => {
    const date = _d('2023-02-15T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 30)
    expect(result).toEqual(_d('2023-02-28T10:00:00.000Z'))
  })

  it('deve clampar dia 31 para fevereiro em ano bissexto (29 dias)', () => {
    const date = _d('2024-02-05T15:30:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result).toEqual(_d('2024-02-29T15:30:00.000Z'))
  })

  it('deve clampar dia 31 para abril (30 dias) - nao deve ir para maio', () => {
    const date = _d('2023-04-10T08:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result.toISOString()).toBe('2023-04-30T08:00:00.000Z')
  })

  it('deve clampar dia 31 para junho (30 dias)', () => {
    const date = _d('2023-06-01T12:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result.toISOString()).toBe('2023-06-30T12:00:00.000Z')
  })

  it('deve clampar dia 31 para setembro (30 dias)', () => {
    const date = _d('2023-09-10T12:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result.toISOString()).toBe('2023-09-30T12:00:00.000Z')
  })

  it('deve clampar dia 31 para novembro (30 dias)', () => {
    const date = _d('2023-11-15T14:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result).toEqual(_d('2023-11-30T14:00:00.000Z'))
  })

  it('deve preservar horario completo ao clampar', () => {
    const date = _d('2023-02-01T14:30:45.999Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result.getUTCHours()).toBe(14)
    expect(result.getUTCMinutes()).toBe(30)
    expect(result.getUTCSeconds()).toBe(45)
    expect(result.getUTCMilliseconds()).toBe(999)
  })

  it('nao deve mutar a data original (imutabilidade)', () => {
    const original = _d('2023-02-01T10:00:00.000Z')
    const originalTime = original.getTime()

    setDayOfMonthClamped(original, 31)

    expect(original.getTime()).toBe(originalTime)
    expect(original.toISOString()).toBe('2023-02-01T10:00:00.000Z')
  })

  it('deve manter dia 1 quando solicitado dia 1', () => {
    const date = _d('2023-02-15T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 1)
    expect(result).toEqual(_d('2023-02-01T10:00:00.000Z'))
  })

  it('deve manter dia 28 de fevereiro quando solicitado 28', () => {
    const date = _d('2023-02-01T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 28)
    expect(result).toEqual(_d('2023-02-28T10:00:00.000Z'))
  })

  it('deve manter dia 31 em janeiro quando solicitado 31', () => {
    const date = _d('2023-01-15T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result).toEqual(_d('2023-01-31T10:00:00.000Z'))
  })

  it('nao deve causar rollover para o mes seguinte - diferenca de setDate nativo', () => {
    const date = _d('2023-02-01T15:00:00.000Z')

    const nativeSetDate = new Date(date)
    nativeSetDate.setDate(31)

    const clamped = setDayOfMonthClamped(date, 31)

    expect(nativeSetDate.getUTCMonth()).toBe(2)
    expect(nativeSetDate.getUTCDate()).toBe(3)

    expect(clamped.getUTCMonth()).toBe(1)
    expect(clamped.getUTCDate()).toBe(28)
  })

  it('deve clampar dia em fevereiro bissexto para 29 quando solicitado 30', () => {
    const date = _d('2024-02-01T12:00:00.000Z')
    const result = setDayOfMonthClamped(date, 30)
    expect(result.getUTCFullYear()).toBe(2024)
    expect(result.getUTCMonth()).toBe(1)
    expect(result.getUTCDate()).toBe(29)
  })

  it('deve preservar ano ao clampar', () => {
    const date = _d('2023-02-01T10:00:00.000Z')
    const result = setDayOfMonthClamped(date, 31)
    expect(result.getUTCFullYear()).toBe(2023)
  })
})
