# Simple RRule

**Uma biblioteca TypeScript simples e poderosa para trabalhar com regras de recorrência (RRule) em calendários.**

Simple RRule é uma implementação simples do padrão RRule, que permite analisar e expandir regras de recorrência baseadas no padrão [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545). Ideal para sistemas de agendamento, calendários e eventos recorrentes, observe que não é uma implementação completa de todas as regras do padrão.

---

![GitHub](https://img.shields.io/github/license/jonasgedrat/simple-rrule)
![npm](https://img.shields.io/npm/dy/simple-rrule)
![GitHub all releases](https://img.shields.io/github/downloads/jonasgedrat/simple-rrule/total)
![npm bundle size](https://img.shields.io/bundlephobia/min/simple-rrule)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/simple-rrule)
![GitHub contributors](https://img.shields.io/github/contributors/jonasgedrat/simple-rrule)

---

## 🚀 Instalação

```bash
# Com npm
npm install simple-rrule

# Com yarn
yarn add simple-rrule

# Com pnpm
pnpm add simple-rrule
```


## 🎯 O que é RRule?

RRule (Recurrence Rule) é um padrão definido no RFC 5545 que permite descrever eventos recorrentes de forma padronizada. Por exemplo:

- "Todo dia às 10h"
- "Toda segunda e quarta-feira"
- "No segundo domingo de cada mês"
- "Anualmente no dia 25 de dezembro"

## 🔧 Principais Funcionalidades

### 1. **Parsing de Strings RRule**
Converte strings RRule em objetos TypeScript tipados:

```typescript
import { parseRecurrenceFromString } from 'simple-rrule'

const rRuleString = `
DTSTART:20231201T100000Z
DTEND:20231201T110000Z
RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=10
`

const rRule = parseRecurrenceFromString(rRuleString)
console.log(rRule?.frequency) // 'WEEKLY'
console.log(rRule?.byDay)     // 'MO,WE,FR'
console.log(rRule?.count)     // 10
```

### 2. **Expansão de Eventos**
Gera todas as datas de um evento recorrente dentro de um período:

```typescript
import { expandRRule } from 'simple-rrule'

const eventos = expandRRule(
    rRule,
    new Date('2023-12-01'), // início do período
    new Date('2024-01-31')  // fim do período
)

console.log(eventos.events.length) // número de eventos encontrados
eventos.events.forEach(evento => {
    console.log(`Evento ${evento.index}: ${evento.date}`)
})
```

### 3. **Geração de Strings RRule**
Cria strings RRule a partir de objetos:

```typescript
import { getRRuleString } from 'simple-rrule'

const rRuleString = getRRuleString({
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z'),
    frequency: 'DAILY',
    interval: 2,
    count: 5
})

console.log(rRuleString)
// DTSTART:20231201T100000Z
// DTEND:20231201T110000Z
// RRULE:FREQ=DAILY;INTERVAL=2;COUNT=5;WKST=SU
```

## 📚 Exemplos Práticos

### Exemplo 1: Reunião Semanal
```typescript
import { expandRRuleFromString } from 'simple-rrule'

// Reunião toda segunda-feira às 14h por 8 semanas
const reuniao = `
DTSTART:20231204T140000Z
DTEND:20231204T150000Z
RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=8
`

const eventos = expandRRuleFromString(
    reuniao,
    new Date('2023-12-01'),
    new Date('2024-02-29')
)

console.log(`${eventos.events.length} reuniões agendadas`)
```

### Exemplo 2: Backup Diário
```typescript
import { parseRecurrenceFromString, expandRRule } from 'simple-rrule'

// Backup todos os dias às 2h da manhã
const backupRule = parseRecurrenceFromString(`
DTSTART:20231201T020000Z
DTEND:20231201T020100Z
RRULE:FREQ=DAILY;INTERVAL=1
`)

if (backupRule) {
    const proximosBackups = expandRRule(
        backupRule,
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // próximos 7 dias
    )
    
    console.log('Próximos backups:')
    proximosBackups.events.forEach(backup => {
        console.log(backup.date.toLocaleString())
    })
}
```

### Exemplo 3: Evento Mensal Complexo
```typescript
// Segunda segunda-feira de cada mês
const eventoMensal = `
DTSTART:20231211T100000Z
DTEND:20231211T120000Z
RRULE:FREQ=MONTHLY;BYDAY=MO;BYSETPOS=2;COUNT=12
`

const eventos = expandRRuleFromString(
    eventoMensal,
    new Date('2023-12-01'),
    new Date('2024-12-31')
)
```

## 🏗️ Tipos TypeScript

A biblioteca oferece tipagem completa para maior segurança:

```typescript
import { 
    Frequency, 
    ByDay, 
    IRrule, 
    IExpandResult 
} from 'simple-rrule'

// Frequências disponíveis
const freq: Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'HOURLY' | 'MINUTELY' | 'SECONDLY'

// Dias da semana
const dias: ByDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

// Interface principal do RRule
interface IRrule {
    dtStart: Date
    dtEnd: Date
    frequency: Frequency
    interval: number
    wkst: ByDay
    count?: number
    until?: Date
    byDay?: string
    byMonth?: number
    byMonthDay?: number
    bySetPos?: number
}
```

## 📖 Referência de Campos RRule

| Campo | Tipo | Obrigatório | Padrão | Descrição |
|-------|------|-------------|--------|-----------|
| `dtStart` | `Date` | ✅ | - | Data e hora de início da recorrência |
| `dtEnd` | `Date` | ✅ | - | Data e hora de fim (para duração) |
| `frequency` | `Frequency` | ✅ | - | Frequência: DAILY, WEEKLY, MONTHLY, etc. |
| `interval` | `number` | ✅ | 1 | Intervalo entre repetições |
| `wkst` | `ByDay` | ✅ | 'SU' | Primeiro dia da semana |
| `count` | `number` | ❌ | - | Número máximo de ocorrências |
| `until` | `Date` | ❌ | - | Data limite para as ocorrências |
| `byDay` | `string` | ❌ | - | Dias da semana (ex: 'MO,WE,FR') |
| `byMonth` | `number` | ❌ | - | Mês específico (1-12) |
| `byMonthDay` | `number` | ❌ | - | Dia do mês (1-31) |
| `bySetPos` | `number` | ❌ | - | Posição na sequência (-1, 1-4) |

## 🔍 Frequências Suportadas

- **MINUTELY**: A cada N minutos  
- **HOURLY**: A cada N horas
- **DAILY**: A cada N dias
- **WEEKLY**: A cada N semanas
- **MONTHLY**: A cada N meses
- **YEARLY**: A cada N anos

## ⚡ Validação Automática

A biblioteca usa Zod para validação automática:

```typescript
// Valores inválidos geram erros claros
const rRule = parseRecurrenceFromString(`
DTSTART:20231201T100000Z
RRULE:FREQ=WEEKLY;INTERVAL=0  // ❌ Interval deve ser >= 1
`)
// Retorna undefined e registra erro de validação
```

## 🧪 Testado e Confiável

- **583 testes** automatizados
- Cobertura completa de casos extremos
- Validação de tipos TypeScript
- Compatível com Vitest

## 📝 Exemplos de Strings RRule

```typescript
// Diário por 30 dias
"DTSTART:20231201T090000Z\nRRULE:FREQ=DAILY;COUNT=30"

// Semanal às terças e quintas
"DTSTART:20231201T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU,TH"

// Mensal no dia 15
"DTSTART:20231215T100000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=15"

// Anual no Natal
"DTSTART:20231225T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25"

// Primeira segunda-feira de cada mês
"DTSTART:20231204T100000Z\nRRULE:FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1"
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja os testes na pasta `test/` para exemplos de uso e casos cobertos.

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Simple RRule** - Tornando regras de recorrência simples e poderosas em TypeScript! 🎯
