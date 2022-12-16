import { IRrule } from './validators/rRule'

export interface IRuleExtended extends IRrule {
    count: number
    startRangePeriod: Date
    endRangePeriodOrUntil: Date
    secondsDuration: number
    hasErrors: boolean
    errorMessages: string
    eventsCount: number
    startIndexCount: number
    firstEventInRangePeriod: Date
}

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
