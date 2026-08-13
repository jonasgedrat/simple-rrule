export type Frequency =
  | 'NEVER'
  | 'YEARLY'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY'
  | 'HOURLY'
  | 'MINUTELY'
  | 'SECONDLY'
export const FrequencyValuesList: Frequency[] = [
  'NEVER',
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
  'MINUTELY',
  'SECONDLY',
]

export type Weekday = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'
export const WeekdayValuesList: Weekday[] = [
  'SU',
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
]

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
// Indice dentro do conjunto de ocorrencias de um unico periodo (mes/ano), nao da serie inteira.
// Negativos contam a partir do fim do periodo (-1 = ultima, -2 = penultima...), garantindo
// semantica estavel mesmo quando o periodo tem 4 ou 5 ocorrencias do dia da semana (ver getBySetPos).
// 0 e o sentinel "nao usado" (ver expandRrule.ts / rRule.ts).
export type BySetPos = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4

export const rRuleFields = {
  RRule: 'RRULE',
  frequency: 'FREQ',
  dtStart: 'DTSTART',
  dtEnd: 'DTEND',
  wkst: 'WKST',

  interval: 'INTERVAL',
  count: 'COUNT',
  until: 'UNTIL',

  bySetPos: 'BYSETPOS',

  byDay: 'BYDAY',
  byMonthDay: 'BYMONTHDAY',
  byMonth: 'BYMONTH',
}

export const YearMonthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
export type YearMonths = (typeof YearMonthsList)[number]

export const MonthDaysList = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
] as const
export type MonthDays = (typeof MonthDaysList)[number]
