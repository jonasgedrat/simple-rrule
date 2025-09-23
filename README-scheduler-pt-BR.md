# 📅 Simple RRule - Scheduler Documentation

**Documentação completa do sistema de expansão de regras de recorrência (expandRrule.ts)**

Este documento detalha as funcionalidades do módulo `expandRrule.ts`, responsável por expandir regras RRule em eventos concretos dentro de períodos específicos.

---

## 🎯 Visão Geral

O módulo `expandRrule.ts` é o coração do sistema de agendamento, transformando regras abstratas de recorrência em listas concretas de eventos com datas específicas. Ele suporta todas as frequências do padrão RFC 5545 e oferece funcionalidades avançadas como `BYSETPOS`, `BYMONTHDAY`, e validação automática.

## 🏗️ Interfaces e Tipos

### `IDateEvents`
Interface que representa um evento individual gerado pela expansão:

```typescript
interface IDateEvents {
    date: Date      // Data específica do evento
    index: number   // Índice sequencial do evento (1, 2, 3...)
}
```

### `IExpandResult`
Interface que encapsula o resultado completo da expansão:

```typescript
interface IExpandResult {
    r: IRuleExtended        // Regra processada e validada
    events: IDateEvents[]   // Lista de eventos gerados
}
```

### `IRuleExtended`
Extensão da interface `IRrule` com campos calculados internamente:

```typescript
interface IRuleExtended extends IRrule {
    startRangePeriod: Date           // Início efetivo do período
    endRangePeriodOrUntil: Date      // Fim efetivo (considerando UNTIL)
    secondsDuration: number          // Duração em segundos
    hasErrors: boolean               // Indica se há erros de validação
    errorMessages: string            // Mensagens de erro detalhadas
    eventsCount: number              // Contador de eventos
    startIndexCount: number          // Índice inicial para contagem
    firstEventInRangePeriod: Date    // Primeiro evento no período
}
```

## 🔧 Funções Principais

### `expandRRule()`
**Função principal para expansão de regras RRule**

```typescript
expandRRule(
    rRulePayload: IRrule,           // Regra RRule a ser expandida
    startRangePeriod: Date,         // Início do período de busca
    endRangePeriod: Date,           // Fim do período de busca
    minimalSecondsDuration?: number // Duração mínima (padrão: 5 minutos)
): IExpandResult
```

**Funcionalidades:**
- ✅ Valida a regra RRule de entrada
- ✅ Ajusta períodos considerando `UNTIL` e `COUNT`
- ✅ Calcula eventos baseados na frequência
- ✅ Aplica filtros de período e contagem
- ✅ Retorna eventos ordenados com índices

**Exemplo:**
```typescript
import { expandRRule } from 'simple-rrule'

const rRule = {
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z'),
    frequency: 'WEEKLY',
    interval: 1,
    byDay: 'MO,WE,FR',
    count: 10,
    wkst: 'SU'
}

const result = expandRRule(
    rRule,
    new Date('2023-12-01'),
    new Date('2024-01-31')
)

console.log(`${result.events.length} eventos encontrados`)
result.events.forEach(event => {
    console.log(`Evento ${event.index}: ${event.date.toISOString()}`)
})
```

### `expandRRuleFromString()`
**Função de conveniência para expansão a partir de strings RRule**

```typescript
expandRRuleFromString(
    rRuleString: string,      // String RRule completa
    startRangePeriod: Date,   // Início do período
    endRangePeriod: Date      // Fim do período
): IExpandResult
```

**Exemplo:**
```typescript
const rRuleString = `
DTSTART:20231201T100000Z
DTEND:20231201T110000Z
RRULE:FREQ=DAILY;INTERVAL=2;COUNT=5
`

const result = expandRRuleFromString(
    rRuleString,
    new Date('2023-12-01'),
    new Date('2023-12-31')
)
```

## 📊 Frequências Suportadas

### 1. **MINUTELY** - A cada N minutos
```typescript
// A cada 30 minutos por 2 horas
const rule = {
    frequency: 'MINUTELY',
    interval: 30,
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T10:01:00Z'),
    count: 4
}
```

### 2. **HOURLY** - A cada N horas
```typescript
// A cada 3 horas por 24 horas
const rule = {
    frequency: 'HOURLY',
    interval: 3,
    dtStart: new Date('2023-12-01T00:00:00Z'),
    dtEnd: new Date('2023-12-01T01:00:00Z'),
    count: 8
}
```

### 3. **DAILY** - A cada N dias
```typescript
// Todos os dias por 1 semana
const rule = {
    frequency: 'DAILY',
    interval: 1,
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z'),
    count: 7
}
```

### 4. **WEEKLY** - A cada N semanas
```typescript
// Toda segunda, quarta e sexta por 4 semanas
const rule = {
    frequency: 'WEEKLY',
    interval: 1,
    byDay: 'MO,WE,FR',
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z'),
    count: 12,
    wkst: 'SU'
}
```

### 5. **MONTHLY** - A cada N meses
```typescript
// Todo dia 15 de cada mês por 6 meses
const rule = {
    frequency: 'MONTHLY',
    interval: 1,
    byMonthDay: 15,
    dtStart: new Date('2023-12-15T10:00:00Z'),
    dtEnd: new Date('2023-12-15T11:00:00Z'),
    count: 6
}
```

### 6. **YEARLY** - A cada N anos
```typescript
// Todo 25 de dezembro
const rule = {
    frequency: 'YEARLY',
    interval: 1,
    byMonth: 12,
    byMonthDay: 25,
    dtStart: new Date('2023-12-25T00:00:00Z'),
    dtEnd: new Date('2023-12-25T01:00:00Z')
}
```

## 🎯 Funcionalidades Avançadas

### **BYSETPOS** - Posição na Sequência
Permite selecionar ocorrências específicas dentro de um conjunto:

```typescript
// Segunda segunda-feira de cada mês
const rule = {
    frequency: 'MONTHLY',
    interval: 1,
    byDay: 'MO',
    bySetPos: 2,  // Segunda ocorrência
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z')
}

// Última sexta-feira de março de cada ano
const rule2 = {
    frequency: 'YEARLY',
    interval: 1,
    byMonth: 3,
    byDay: 'FR',
    bySetPos: -1,  // Última ocorrência
    dtStart: new Date('2023-03-01T10:00:00Z'),
    dtEnd: new Date('2023-03-01T11:00:00Z')
}
```

**Valores suportados:**
- `1, 2, 3, 4`: Primeira, segunda, terceira, quarta ocorrência
- `-1`: Última ocorrência

### **BYMONTHDAY** - Dia Específico do Mês
```typescript
// Todo dia 1º e 15 de cada mês
const rule = {
    frequency: 'MONTHLY',
    interval: 1,
    byMonthDay: 1,  // Ou 15
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z')
}
```

### **BYMONTH** - Mês Específico
```typescript
// Todo dezembro (anual)
const rule = {
    frequency: 'YEARLY',
    interval: 1,
    byMonth: 12,
    byMonthDay: 25,
    dtStart: new Date('2023-12-25T10:00:00Z'),
    dtEnd: new Date('2023-12-25T11:00:00Z')
}
```

### **BYDAY** - Dias da Semana
```typescript
// Segundas, quartas e sextas
const rule = {
    frequency: 'WEEKLY',
    interval: 1,
    byDay: 'MO,WE,FR',
    dtStart: new Date('2023-12-01T10:00:00Z'),
    dtEnd: new Date('2023-12-01T11:00:00Z'),
    wkst: 'SU'  // Semana começa no domingo
}
```

**Códigos dos dias:**
- `SU`: Domingo
- `MO`: Segunda-feira
- `TU`: Terça-feira
- `WE`: Quarta-feira
- `TH`: Quinta-feira
- `FR`: Sexta-feira
- `SA`: Sábado

## 🔍 Algoritmos Internos

### **Cálculo de Índices**
O sistema calcula automaticamente os índices dos eventos, considerando:
- Eventos anteriores ao período de busca
- Intervalos entre recorrências
- Limitações de `COUNT`

### **Otimização de Performance**
- **Pré-cálculo**: Determina o primeiro evento no período sem gerar todos os anteriores
- **Filtragem eficiente**: Aplica filtros durante a geração, não após
- **Validação prévia**: Evita processamento desnecessário em regras inválidas

### **Tratamento de Períodos**
```typescript
// O sistema ajusta automaticamente os períodos considerando:
// 1. UNTIL vs endRangePeriod (usa o menor)
// 2. dtStart vs startRangePeriod (usa o maior)
// 3. Duração dos eventos (subtrai da data final)
```

## ⚠️ Validações e Tratamento de Erros

### **Validações Automáticas**
- ✅ `dtStart` deve ser anterior a `dtEnd`
- ✅ `interval` deve ser maior que 0
- ✅ `until` deve ser posterior a `dtStart`
- ✅ Códigos de dias da semana válidos
- ✅ Valores de `bySetPos` dentro do range (-1, 1-4)

### **Tratamento de Erros**
```typescript
const result = expandRRule(invalidRule, start, end)

if (result.r.hasErrors) {
    console.error('Erros encontrados:', result.r.errorMessages)
    console.log('Eventos gerados:', result.events.length) // Será 0
}
```

### **Casos Especiais**
- **Regras sem eventos**: Retorna array vazio
- **Períodos inválidos**: Marca como erro e retorna vazio
- **COUNT excedido**: Para a geração automaticamente
- **UNTIL no passado**: Considera apenas eventos válidos

## 📈 Exemplos Práticos Avançados

### **Sistema de Backup Inteligente**
```typescript
// Backup diário nos dias úteis
const backupRule = {
    frequency: 'WEEKLY',
    interval: 1,
    byDay: 'MO,TU,WE,TH,FR',
    dtStart: new Date('2023-12-01T02:00:00Z'),
    dtEnd: new Date('2023-12-01T02:30:00Z'),
    wkst: 'SU'
}

const backups = expandRRule(
    backupRule,
    new Date('2023-12-01'),
    new Date('2024-01-31')
)

console.log(`${backups.events.length} backups agendados`)
```

### **Reuniões Corporativas Complexas**
```typescript
// Primeira segunda-feira de cada mês às 14h
const monthlyMeeting = {
    frequency: 'MONTHLY',
    interval: 1,
    byDay: 'MO',
    bySetPos: 1,
    dtStart: new Date('2023-12-04T14:00:00Z'),
    dtEnd: new Date('2023-12-04T16:00:00Z')
}

const meetings = expandRRule(
    monthlyMeeting,
    new Date('2023-12-01'),
    new Date('2024-12-31')
)
```

### **Manutenção Trimestral**
```typescript
// A cada 3 meses no dia 1º
const maintenance = {
    frequency: 'MONTHLY',
    interval: 3,
    byMonthDay: 1,
    dtStart: new Date('2024-01-01T00:00:00Z'),
    dtEnd: new Date('2024-01-01T04:00:00Z'),
    count: 4  // Apenas 4 manutenções
}

const maintenances = expandRRule(
    maintenance,
    new Date('2024-01-01'),
    new Date('2024-12-31')
)
```

## 🧪 Testes e Validação

O módulo possui **583 testes automatizados** cobrindo:

- ✅ Todas as frequências (MINUTELY a YEARLY)
- ✅ Combinações de BYSETPOS com diferentes frequências
- ✅ Validação de períodos e contadores
- ✅ Casos extremos e limites
- ✅ Performance com grandes volumes
- ✅ Integração com diferentes fusos horários

### **Executar Testes**
```bash
# Todos os testes
npm test

# Apenas testes do expandRrule
npm test expandRrule
```

## 🚀 Performance e Otimizações

### **Benchmarks Típicos**
- **Eventos diários por 1 ano**: ~1ms
- **Eventos semanais por 5 anos**: ~2ms
- **Eventos mensais por 10 anos**: ~5ms
- **BYSETPOS complexo por 1 ano**: ~10ms

### **Dicas de Performance**
1. **Use períodos específicos**: Evite períodos muito amplos desnecessariamente
2. **Prefira COUNT a UNTIL**: Mais eficiente para sequências finitas
3. **BYSETPOS**: Use apenas quando necessário (mais custoso)
4. **Cache resultados**: Para regras repetitivas, considere cache

## 📚 Referências Técnicas

- **RFC 5545**: [Internet Calendaring and Scheduling Core Object Specification](https://tools.ietf.org/html/rfc5545)
- **Algoritmos de data**: Baseados em bibliotecas otimizadas
- **Validação**: Powered by Zod para type safety

---

**Simple RRule Scheduler** - Transformando regras em eventos reais com precisão e performance! 🎯