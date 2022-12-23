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

export type ByDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | string

export type BySetPos = -1 | 0 | 1 | 2 | 3 | 4 | number

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

    byMinute: 'BYMINUTE',
    byHour: 'BYHOUR',
    byDay: 'BYDAY',
    byMonthDay: 'BYMONTHDAY',
    byMonth: 'BYMONTH',
    byYearDay: 'BYEARDAY',
}
