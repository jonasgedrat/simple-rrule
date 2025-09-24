<p>
  <img alt="license" src="https://img.shields.io/github/license/jonasgedrat/simple-rrule"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dy/simple-rrule"/>
  <img alt="Github Stars" src="https://badgen.net/github/stars/jonasgedrat/simple-rrule" />
  <img alt="minified size" src="https://img.shields.io/bundlephobia/min/simple-rrule" />
  <img alt="minzipped size" src="https://img.shields.io/bundlephobia/minzip/simple-rrule" />
  <img alt="contributors" src="https://img.shields.io/github/contributors/jonasgedrat/simple-rrule" />
</p>

# Simple RRule
**A simple and high-performance TypeScript library for working with recurrence rules (RRule).**

A simple implementation of the RRule standard [iCalendar RFC 5545](https://tools.ietf.org/html/rfc5545). Note that this is not a complete implementation of all standard rules, it allows parsing and expanding recurrence rules. Ideal for getting the complete set of recurring events in a calendar, the simple-rrule library aims to simplify this process.

## 🎯 RRule
- Every day at 10 AM or, every day every 10 hours or, every Monday and Wednesday or, on the second Sunday of each month or, Christmas: annually on December 25th.....

**Important: Does not work with TZ timezone.**

**Example:**
```typescript
import { expandRRule,rRuleDefaultValues } from 'simple-rrule'

const rRule: IRrule = {
    ...rRuleDefaultValues,//default values
    dtStart: new Date('2023-01-01T10:00:00.000Z'), //start of year 2023
    dtEnd: new Date('2023-01-01T11:00:00.000Z'),//duration of 1 hour          
    frequency: 'HOURLY',
    interval: 10 // every 10 hours
}
//returns the rRuleString
const rRuleString = getRRuleString(rRule)
console.log(rRuleString)
// DTSTART:20230101T100000Z
// DTEND:20230101T110000Z
// RRULE:FREQ=HOURLY;INTERVAL=10;WKST=SU

 //returns the rRule object
 const parseR = parseRecurrenceFromString(rRuleString)

const result1 = expandRRule(
    rRule,
    new Date('2023-12-31'),
    new Date('2024-01-01')//year transition
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
    new Date('2024-03-01') //leap year
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
expandRRule is focused on performance, it doesn't build event loops from the beginning.
To optimize performance it makes calculations and returns events within the specified period, the index in events is the event counter.
## ⚡ Automatic Validation

The library uses Zod4 for automatic validation in main functions:

```typescript
// Invalid values generate clear errors
const rRule = parseRecurrenceFromString(`
DTSTART:20231201T100000Z
RRULE:FREQ=WEEKLY;INTERVAL=0  // ❌ Interval must be >= 1
`)
// Returns undefined and logs validation error
```
## 🔍 Supported Frequencies

- **MINUTELY**: Every N minutes  
- **HOURLY**: Every N hours
- **DAILY**: Every N days
- **WEEKLY**: Every N weeks
- **MONTHLY**: Every N months
- **YEARLY**: Every N years
## 🧪 Tested and Reliable

- **580++ tests** automated
- Complete coverage of edge cases
- TypeScript type validation
- Compatible with Vitest

```typescript
type IRrule = {
    dtStart: Date;
    dtEnd: Date;
    frequency: Frequency;
    interval: number;
    count: number;
    byDay: string;
    byMonth: number;
    byMonthDay: number;
    bySetPos: number;
    wkst: Weekday;
    until?: Date | undefined;
}

```


## 🔧 TODO: Documentation
This library has extensive test coverage, but needs help with documentation.


### The Simple RRule library exports the following functions: 
- `expandRRule` and `expandRRuleFromString` for rule expansion
- `getRRuleString` for RRule string generation 
- `parseRecurrenceFromString` for RRule string parsing
- `parseWeekDay` for weekday conversion
- `validateRrule` for rule validation

### It also exports date utility functions
`addDays`, `addHours`, `addMinutes`, `addMonths`, `addYears`, `addWeeks`, `addSeconds`, `addMilliseconds`, `differenceInDays`, `differenceInHours`, `differenceInMinutes`, `differenceInMonths`, `differenceInSeconds`, `differenceInWeeks`, `differenceInYears`, `differenceInMilliseconds`, `eachDateOfInterval`, `getStartOfWeekWithoutChangeTime`, `getWeekDayFromDate`, `getWeekDayName`, `getDayFromWeekDay`, `isBefore`, `isLastDayOfMonth`, `compareAsc`, `setByDay`, `setByMonth`, `toRRuleDateString`, `fromRruleDateStringToDate`, `isDate`, `isWeekDayValid`, `isBySetPosValid`, `getBySetPos`, `eachMonthOfIntervalWithTime`, `eachYearOfIntervalWithTime`
#### as well as types and constants like `FrequencyValues`, `ByDayValues`, `WeekdayValues`, `rRuleFields`, interfaces `IDateEvents`, `IExpandResult`, `IRrule`, `IRuleExtended`, `ISchedulerEditor`, `IWeekDayInfo` and types `Frequency`, `ByDay`, `Weekday`, `Day`, `Month`, `BySetPos`, `YearMonths`, `MonthDays`.


## 🚀 Installation

```bash
# With npm
npm install simple-rrule

# With yarn
yarn add simple-rrule

# With pnpm
pnpm add simple-rrule
```



