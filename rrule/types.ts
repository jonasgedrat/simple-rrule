import { addMinutes } from 'date-fns'

export interface ISchedulerEditorSchema {
    id: string
    title: string
    dtStart: Date
    dtEnd: Date

    frequency: Frequency
    interval: number
    count: number
    until?: Date

    byDay: string
    byMonth: number
    byMonthDay: number
    bySetPos: number

    wkst: Weekday
}

export interface IRrule {
    dtStart: Date
    dtEnd: Date
    weekStartOn: Weekday

    frequency: Frequency
    interval: number
    count?: number
    until?: Date

    bySecond?: number
    byMinute?: number
    byHour?: number
    byDay?: string
    byMonth?: number
    byMonthDay?: number
    byYearDay?: number
    bySetPos?: number
}

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

export const rRuleDefault: IRrule = {
    frequency: Frequency.NEVER,
    dtStart: new Date(),
    dtEnd: addMinutes(new Date(), 60),
    weekStartOn: Weekday.Sunday,

    interval: 1,
    count: undefined,
    until: undefined,

    bySetPos: undefined,

    bySecond: undefined,
    byMinute: undefined,
    byHour: undefined,
    byDay: undefined,
    byMonth: undefined,
    byMonthDay: undefined,
    byYearDay: undefined,
}

export const rRuleFields = {
    RRule: 'RRULE',
    frequency: 'FREQ',
    dtStart: 'DTSTART',
    dtEnd: 'DTEND',
    weekStartOn: 'WKST',

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
