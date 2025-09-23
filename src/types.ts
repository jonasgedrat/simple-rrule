export const FrequencyValues = {
    NEVER: 'NEVER',
    YEARLY: 'YEARLY',
    MONTHLY: 'MONTHLY',
    WEEKLY: 'WEEKLY',
    DAILY: 'DAILY',
    HOURLY: 'HOURLY',
    MINUTELY: 'MINUTELY',
    SECONDLY: 'SECONDLY',
} as const
export const FrequencyValuesList = Object.values(FrequencyValues)
export type Frequency = (typeof FrequencyValues)[keyof typeof FrequencyValues]

export const ByDayValues = {
    SU: 'SU',
    MO: 'MO',
    TU: 'TU',
    WE: 'WE',
    TH: 'TH',
    FR: 'FR',
    SA: 'SA',
} as const
export const ByDayValuesList = Object.values(ByDayValues)
export type ByDay = (typeof ByDayValues)[keyof typeof ByDayValues]

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type BySetPos = -1 | 0 | 1 | 2 | 3 | 4

export const WeekdayValues = {
    Sunday: 'SU',
    Monday: 'MO',
    Tuesday: 'TU',
    Wednesday: 'WE',
    Thursday: 'TH',
    Friday: 'FR',
    Saturday: 'SA',
} as const
export const WeekdayValuesList = Object.values(WeekdayValues)
export type Weekday = (typeof WeekdayValues)[keyof typeof WeekdayValues]

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

export type YearMonths = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type MonthDays =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
