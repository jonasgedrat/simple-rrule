<p>
  <img alt="license" src="https://img.shields.io/github/license/jonasgedrat/simple-rrule"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dy/simple-rrule"/>
  <img alt="Github Stars" src="https://badgen.net/github/stars/jonasgedrat/simple-rrule" />
  <img alt="minified size" src="https://img.shields.io/bundlephobia/min/simple-rrule" />
  <img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/simple-rrule" />
  <img alt="contributors" src="https://img.shields.io/github/contributors/jonasgedrat/simple-rrule" />
</p>

# Simple RRule

**Uma biblioteca TypeScript simples e de alta performance para trabalhar com regras de recorrência (RRule).**

Uma implementação simples do padrão RRule [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545), observe que não é uma implementação completa de todas as regras do padrão, permite analisar e expandir regras de recorrência. Ideal para obter o conjunto completo de eventos recorrentes em um calendário, a biblioteca simple-rrule visa simplificar esse processo.

## 🎯 RRule

- Todo dia às 10 horas ou, todo dia a cada 10 horas ou, toda segunda e quarta-feira ou, no segundo domingo de cada mês ou , natal: anualmente no dia 25 de dezembro.....

**Importante: Não trabalha com TZ timezone.**

**Exemplo:**

```typescript
import { expandRRule, rRuleDefaultValues } from 'simple-rrule'

const rRule: IRrule = {
  ...rRuleDefaultValues, //valores padrão
  dtStart: '2023-01-01T10:00:00.000Z', //inicio do ano de 2023
  dtEnd: '2023-01-01T11:00:00.000Z', //duração de 1 hora
  frequency: 'HOURLY',
  interval: 10, // a cada 10 horas
}
//retorna o rRuleString
const rRuleString = getRRuleString(rRule)
console.log(rRuleString)
// DTSTART:20230101T100000Z
// DTEND:20230101T110000Z
// RRULE:FREQ=HOURLY;INTERVAL=10;WKST=SU

//retorna o objeto rRule
const parseR = parseRecurrenceFromString(rRuleString)

const result1 = expandRRule(
  rRule,
  new Date('2023-12-31'),
  new Date('2024-01-01') //virada do ano
)
console.log('result1', result1)
// result {
//   r: {
//     dtStart: 2023-01-01T10:00:00.000Z,
//     dtEnd: 2023-01-01T11:00:00.000Z,
//     frequency: 'HOURLY',
//     interval: 10,
//     count: 0,
//     byDay: '',
//     byMonth: 0,
//     byMonthDay: 0,
//     bySetPos: 0,
//     wkst: 'SU',
//     startRangePeriod: 2023-12-31T00:00:00.000Z,
//     endRangePeriodOrUntil: 2024-01-01T00:00:00.000Z,
//     secondsDuration: 3600,
//     hasErrors: false,
//     errorMessages: '',
//     eventsCount: 0,
//     startIndexCount: 37,
//     firstEventInRangePeriod: 2023-01-16T20:00:00.000Z
//   },
//   events: [
//     { date: 2023-12-31T04:00:00.000Z, index: 874 },
//     { date: 2023-12-31T14:00:00.000Z, index: 875 },
//     { date: 2024-01-01T00:00:00.000Z, index: 876 }
//   ]
// }

const result2 = expandRRule(
  rRule,
  new Date('2024-02-28'),
  new Date('2024-03-01') //ano bisexto
)
console.log(result2)
// result2 {
//   r: {
//     dtStart: 2023-01-01T10:00:00.000Z,
//     dtEnd: 2023-01-01T11:00:00.000Z,
//     frequency: 'HOURLY',
//     interval: 10,
//     count: 0,
//     byDay: '',
//     byMonth: 0,
//     byMonthDay: 0,
//     bySetPos: 0,
//     wkst: 'SU',
//     startRangePeriod: 2024-02-28T00:00:00.000Z,
//     endRangePeriodOrUntil: 2024-03-01T00:00:00.000Z,
//     secondsDuration: 3600,
//     hasErrors: false,
//     errorMessages: '',
//     eventsCount: 0,
//     startIndexCount: 43,
//     firstEventInRangePeriod: 2023-01-19T08:00:00.000Z
//   },
//   events: [
//     { date: 2024-02-28T08:00:00.000Z, index: 1016 },
//     { date: 2024-02-28T18:00:00.000Z, index: 1017 },
//     { date: 2024-02-29T04:00:00.000Z, index: 1018 },
//     { date: 2024-02-29T14:00:00.000Z, index: 1019 },
//     { date: 2024-03-01T00:00:00.000Z, index: 1020 }
//   ]
// }
```

## 🔍 expandRRule

expandRRule é focado em performance, não monta loop de eventos desde o início.
Para otimizar a performance faz cálculos e retorna os eventos dentro do período informado, o index em events é o contador do evento.

## ⚡ Validação Automática

A biblioteca usa Zod4 para validação automática em funções principais:

```typescript
// Valores inválidos geram erros claros
const rRule = parseRecurrenceFromString(`
DTSTART:20231201T100000Z
RRULE:FREQ=WEEKLY;INTERVAL=0  // ❌ Interval deve ser >= 1
`)
// Retorna undefined e registra erro de validação
```

## 🔍 Frequências Suportadas

- **MINUTELY**: A cada N minutos
- **HOURLY**: A cada N horas
- **DAILY**: A cada N dias
- **WEEKLY**: A cada N semanas
- **MONTHLY**: A cada N meses
- **YEARLY**: A cada N anos

## 🧪 Testado e Confiável

- **580++ testes** automatizados
- Cobertura completa de casos extremos
- Validação de tipos TypeScript
- Compatível com Vitest

```typescript
type IRrule = {
  dtStart: string //iso datetime
  dtEnd: string //iso datetime
  frequency: Frequency
  interval: number
  count: number
  byDay: string
  byMonth: number
  byMonthDay: number
  bySetPos: number
  wkst: Weekday
  until?: string | undefined //iso datetime
}
```

## 🔧 TODO: Documentação

Esta biblioteca está com ampla cobertura de testes, mas precisa de auxilio para documentação.

### A biblioteca Simple RRule exporta as seguintes funções:

- `expandRRule` e `expandRRuleFromString` para expansão de regras
- `getRRuleString` para geração de string RRule
- `parseRecurrenceFromString` para parsing de string RRule
- `parseWeekDay` para conversão de dias da semana
- `validateRrule` para validação de regras

### Também exporta funções utilitárias de datas

`addDays`, `addHours`, `addMinutes`, `addMonths`, `addYears`, `addWeeks`, `addSeconds`, `addMilliseconds`, `differenceInDays`, `differenceInHours`, `differenceInMinutes`, `differenceInMonths`, `differenceInSeconds`, `differenceInWeeks`, `differenceInYears`, `differenceInMilliseconds`, `eachDateOfInterval`, `getStartOfWeekWithoutChangeTime`, `getWeekDayFromDate`, `getWeekDayName`, `isBefore`, `isLastDayOfMonth`, `compareAsc`, `setByDay`, `setByMonth`, `toRRuleDateString`, `fromRruleDateStringToDate`, `isDate`, `isWeekDayValid`, `isBySetPosValid`, `getBySetPos`, `eachMonthOfIntervalWithTime`, `eachYearOfIntervalWithTime`

#### além de tipos e constantes como `rRuleFields`, interfaces `IDateEvents`, `IExpandResult`, `IRrule`, `IRuleExtended`, `IWeekDayInfo` e tipos `Frequency`, `Weekday`, `Day`, `Month`, `BySetPos`, `YearMonths`, `MonthDays`.

## 🚀 Instalação

```bash
# Com npm
npm install simple-rrule

# Com yarn
yarn add simple-rrule

# Com pnpm
pnpm add simple-rrule
```
