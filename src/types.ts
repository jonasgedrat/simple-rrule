export enum Frequency {
    NEVER = 'NEVER',
    YEARLY = 'YEARLY',
    MONTHLY = 'MONTHLY',
    WEEKLY = 'WEEKLY',
    DAILY = 'DAILY',
    HOURLY = 'HOURLY',
    MINUTELY = 'MINUTELY',
    SECONDLY = 'SECONDLY',
}

export type ByDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export type BySetPos = -1 | 0 | 1 | 2 | 3 | 4

export enum Weekday {
    Sunday = 'SU',
    Monday = 'MO',
    Tuesday = 'TU',
    Wednesday = 'WE',
    Thursday = 'TH',
    Friday = 'FR',
    Saturday = 'SA',
}

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
