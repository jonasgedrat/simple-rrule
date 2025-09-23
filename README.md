# Simple RRule

**A simple and powerful TypeScript library for working with calendar recurrence rules (RRule).**

Simple RRule is a simple implementation of the RRule standard, which allows parsing and expanding recurrence rules based on the [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545) standard. Ideal for scheduling systems, calendars and recurring events, note that it is not a complete implementation of all the standard rules.

---

![GitHub](https://img.shields.io/github/license/jonasgedrat/simple-rrule)
![npm](https://img.shields.io/npm/dy/simple-rrule)
![GitHub all releases](https://img.shields.io/github/downloads/jonasgedrat/simple-rrule/total)
![npm bundle size](https://img.shields.io/bundlephobia/min/simple-rrule)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/simple-rrule)
![GitHub contributors](https://img.shields.io/github/contributors/jonasgedrat/simple-rrule)

---

## 🚀 Installation

```bash
# With npm
npm install simple-rrule

# With yarn
yarn add simple-rrule

# With pnpm
pnpm add simple-rrule
```


## 🎯 What is RRule?

RRule (Recurrence Rule) is a standard defined in RFC 5545 that allows describing recurring events in a standardized way. For example:

- "Every day at 10am"
- "Every Monday and Wednesday"
- "On the second Sunday of each month"
- "Annually on December 25th"

## 🔧 Main Features

### 1. **RRule String Parsing**
Converts RRule strings into typed TypeScript objects:

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

### 2. **Event Expansion**
Generates all dates of a recurring event within a period:

```typescript
import { expandRRule } from 'simple-rrule'

const events = expandRRule(
    rRule,
    new Date('2023-12-01'), // period start
    new Date('2024-01-31')  // period end
)

console.log(events.events.length) // number of events found
events.events.forEach(event => {
    console.log(`Event ${event.index}: ${event.date}`)
})
```

### 3. **RRule String Generation**
Creates RRule strings from objects:

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

## 📚 Practical Examples

### Example 1: Weekly Meeting
```typescript
import { expandRRuleFromString } from 'simple-rrule'

// Meeting every Monday at 2pm for 8 weeks
const meeting = `
DTSTART:20231204T140000Z
DTEND:20231204T150000Z
RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=8
`

const events = expandRRuleFromString(
    meeting,
    new Date('2023-12-01'),
    new Date('2024-02-29')
)

console.log(`${events.events.length} meetings scheduled`)
```

### Example 2: Daily Backup
```typescript
import { parseRecurrenceFromString, expandRRule } from 'simple-rrule'

// Backup every day at 2am
const backupRule = parseRecurrenceFromString(`
DTSTART:20231201T020000Z
DTEND:20231201T020100Z
RRULE:FREQ=DAILY;INTERVAL=1
`)

if (backupRule) {
    const nextBackups = expandRRule(
        backupRule,
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // next 7 days
    )
    
    console.log('Next backups:')
    nextBackups.events.forEach(backup => {
        console.log(backup.date.toLocaleString())
    })
}
```

### Example 3: Complex Monthly Event
```typescript
// Second Monday of each month
const monthlyEvent = `
DTSTART:20231211T100000Z
DTEND:20231211T120000Z
RRULE:FREQ=MONTHLY;BYDAY=MO;BYSETPOS=2;COUNT=12
`

const events = expandRRuleFromString(
    monthlyEvent,
    new Date('2023-12-01'),
    new Date('2024-12-31')
)
```

## 🏗️ TypeScript Types

The library offers complete typing for greater safety:

```typescript
import { 
    Frequency, 
    ByDay, 
    IRrule, 
    IExpandResult 
} from 'simple-rrule'

// Available frequencies
const freq: Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'HOURLY' | 'MINUTELY' | 'SECONDLY'

// Days of the week
const days: ByDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

// Main RRule interface
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

## 📖 RRule Fields Reference

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `dtStart` | `Date` | ✅ | - | Recurrence start date and time |
| `dtEnd` | `Date` | ✅ | - | End date and time (for duration) |
| `frequency` | `Frequency` | ✅ | - | Frequency: DAILY, WEEKLY, MONTHLY, etc. |
| `interval` | `number` | ✅ | 1 | Interval between repetitions |
| `wkst` | `ByDay` | ✅ | 'SU' | First day of the week |
| `count` | `number` | ❌ | - | Maximum number of occurrences |
| `until` | `Date` | ❌ | - | End date for occurrences |
| `byDay` | `string` | ❌ | - | Days of the week (ex: 'MO,WE,FR') |
| `byMonth` | `number` | ❌ | - | Specific month (1-12) |
| `byMonthDay` | `number` | ❌ | - | Day of the month (1-31) |
| `bySetPos` | `number` | ❌ | - | Position in sequence (-1, 1-4) |

## 🔍 Supported Frequencies

- **MINUTELY**: Every N minutes  
- **HOURLY**: Every N hours
- **DAILY**: Every N days
- **WEEKLY**: Every N weeks
- **MONTHLY**: Every N months
- **YEARLY**: Every N years

## ⚡ Automatic Validation

The library uses Zod for automatic validation:

```typescript
// Invalid values generate clear errors
const rRule = parseRecurrenceFromString(`
DTSTART:20231201T100000Z
RRULE:FREQ=WEEKLY;INTERVAL=0  // ❌ Interval must be >= 1
`)
// Returns undefined and logs validation error
```

## 🧪 Tested and Reliable

- **583 automated tests**
- Complete coverage of edge cases
- TypeScript type validation
- Compatible with Vitest

## 📝 RRule String Examples

```typescript
// Daily for 30 days
"DTSTART:20231201T090000Z\nRRULE:FREQ=DAILY;COUNT=30"

// Weekly on Tuesdays and Thursdays
"DTSTART:20231201T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU,TH"

// Monthly on the 15th
"DTSTART:20231215T100000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=15"

// Annually on Christmas
"DTSTART:20231225T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25"

// First Monday of each month
"DTSTART:20231204T100000Z\nRRULE:FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1"
```

## 🤝 Contributing

Contributions are welcome! See the tests in the `test/` folder for usage examples and covered cases.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Simple RRule** - Making recurrence rules simple and powerful in TypeScript! 🎯