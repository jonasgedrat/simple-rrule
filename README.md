# simple-rrule.js

Production Version 1.1.0+

**Simple recurrence rules to get scheduler events for calendar dates.**

simple-rrule.js expands recurrence dates from a rrule string.

rules as defined in the [iCalendar
RFC](https://tools.ietf.org/html/rfc5545) (with partial implementation)

---

![GitHub](https://img.shields.io/github/license/jonasgedrat/simple-rrule)
![npm](https://img.shields.io/npm/dy/simple-rrule)
![GitHub all releases](https://img.shields.io/github/downloads/jonasgedrat/simple-rrule/total)
![npm bundle size](https://img.shields.io/bundlephobia/min/simple-rrule)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/simple-rrule)
![GitHub contributors](https://img.shields.io/github/contributors/jonasgedrat/simple-rrule)

---

rrule.js supports recurrence rules as defined in the [iCalendar
RFC](https://tools.ietf.org/html/rfc5545), with a few important
[differences](#differences-from-icalendar-rfc). It is a partial port of the
`rrule` module from the excellent
[python-dateutil](http://labix.org/python-dateutil/) library. On top of
that, it supports parsing and serialization of recurrence rules from and
to natural language.

---

### Quick Start

Includes optional TypeScript types

```bash
$ yarn add simple-rrule
# or
$ npm install simple-rrule
```

#### Example 1

```es6
import { expandRRuleFromString } from 'simple-rrule'

const rRule =
    'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYDAY=MO;BYMONTH=1;BYSETPOS=2;COUNT=5;WKST=SU'
const rRule = `DTSTART:DTSTART:20221215T100000Z\nRRULE:FREQ=DAILY;INTERVAL=1;COUNT=3;WKST=SU`

const r = expandRRuleFromString(rRule, today, addDays(today, 3))
```

#### Example 2

```es6
import { parseRecurrenceFromString, expandRRule, WeekDay } from 'simple-rrule'
const rRule =
    'DTSTART:20221216T100000Z\nRRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=WE;UNTIL=20230411T100000Z;WKST=SU'

const rRule = await parseRecurrenceFromString(rRule, Weekday.Sunday)
console.log(rRule)

const r = expandRRule(
    rRule,
    new Date('2023-02-02T10:00:00.000Z'),
    new Date('2023-12-31T10:00:00.000Z')
)
```

#### Example 3

```es6
import { expandRRuleFromString } from 'simple-rrule'

const rRule =
    'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYDAY=MO;BYMONTH=1;BYSETPOS=2;COUNT=5;WKST=SU'

const r = expandRRuleFromString(
    rRule,
    new Date('2023-01-28T10:00:00.000Z'),
    new Date('2025-05-31T10:00:00.000Z')
)
```

#### Example 4

```es6
import { expandRRuleFromString } from 'simple-rrule'

const rRule =
    'DTSTART:20221215T100000Z\nRRULE:FREQ=YEARLY;BYDAY=MO;BYMONTH=1;BYSETPOS=2;COUNT=5;WKST=SU'

const r = expandRRuleFromString(
    rRule,
    new Date('2023-01-28T10:00:00.000Z'),
    new Date('2025-05-31T10:00:00.000Z')
)
```

# Good examples in 'test' folder.

### rrule string fields

<table>
    <!-- why, markdown... -->
    <thead>
    <tr>
        <th>Field</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <thead>
    <tbody>
    <tr>
        <td><code>dtStart</code></td>
        <td><code>Date</code></td>        
        <td>Y</td>
        <td></td>
        <td>The recurrence start.</td>
    </tr>
    <tr>
        <td><code>dtEnd</code></td>
        <td><code>Date</code></td>        
        <td>Y</td>
        <td></td>
        <td>Used for duration (dtStart-dtEnd)</td>
    </tr>
    <tr>
        <td><code>frequency</code></td>
        <td><code>Frequency as String</code></td>
        <td>Y</td>
        <td></td>
        <td>
            <ul>
                <li><code>Frequency.YEARLY</code></li>
                <li><code>Frequency.MONTHLY</code></li>
                <li><code>Frequency.WEEKLY</code></li>
                <li><code>Frequency.DAILY</code></li>
                <li><code>Frequency.HOURLY</code></li>
                <li><code>Frequency.MINUTELY</code></li>
                <li><code>Frequency.SECONDLY</code></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>interval</code></td>
        <td><code>Positive Integer</code></td>        
        <td>Y</td>
        <td>1</td>
        <td>The interval between each freq iteration</td>
    </tr>
    <tr>
        <td><code>wkst</code></td>
        <td><code>Weekday as String</code></td>        
        <td>Y</td>
        <td>'SU'</td>
        <td>The week start day.</td>
    </tr>  
    <tr>
        <td><code>count</code></td>
        <td><code>Positive Integer</code></td>        
        <td>N</td>
        <td></td>
        <td>How many occurrences will be generated.</td>
    </tr>  
    <tr>
        <td><code>until</code></td>
        <td><code>Date</code></td>        
        <td>N</td>
        <td></td>
        <td>End limit of recurrence dates generated.</td>
    </tr>
        <tr>
        <td><code>byday</code></td>
        <td><code>WeekDay[] as String</code></td>
        <td>N</td>
        <td></td>
        <td>Weekday or WeekDays ex: 'SU' or 'SU,MO,FR'</td>
    </tr>
    <tr>
        <td><code>bysetpos</code></td>
        <td><code>Integer</code></td>
        <td>N</td>
        <td></td>
        <td>Used only in byMonth and byYear</td>
    </tr>
    <tr>
        <td><code>bymonth</code></td>
        <td><code>Integer</code></td>
        <td>N</td>
        <td></td>
        <td>Month</td>
    </tr>
    <tr>
        <td><code>bymonthday</code></td>
        <td><code>Integer</code></td>
        <td>N</td>
        <td></td>
        <td>Month day</td>
    </tr>  
    </tbody>
</table>

---
