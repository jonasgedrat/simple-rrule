# simple-rrule.js

## BETA VERSION

**Simple recurrence rules to get scheduler events for calendar dates.**

simple-rrule.js expands recurrence dates from a rrule string.

rules as defined in the [iCalendar
RFC](https://tools.ietf.org/html/rfc5545) (with partial implementation)

---

### Quick Start

Includes optional TypeScript types

```bash
$ yarn add simple-rrule
# or
$ npm install simple-rrule
```

#### Example: get events with rrule string

```es6
import { expandRRule } from 'simple-rrule'

const rRule = 'DTSTART:20221214T072400Z\nRRULE:FREQ=DAILY;INTERVAL=1;WKST=SU'

const startRangePeriod = new Date(2023, 1, 1)
const endRangePeriod = new Date(2023, 2, 1)

const result = expandRRule(rRule, startRangePeriod, endRangePeriod)
```

#### Example: get events from ISchedulerEditorSchema

```es6
import { expandRRule, getRRuleString, ISchedulerEditorSchema, Frequency  } from 'simple-rrule'

//Get with rrule string
const rrule: ISchedulerEditorSchema = {
    dtStart: new Date{2022, 12, 1, 10 ,30},
    dtEnd: new Date{2022, 12, 1, 10, 45},//Event duration = 15 minutes
    frequency: Frequency.DAILY,
    interval:1

}
//range period to extract dates
const startRangePeriod = new Date(2023, 1, 1)
const startRangePeriod = new Date(2023, 2, 1)

const result = expandRRule(getRRuleString(rrule), startRangePeriod, endRangePeriod)
```

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

