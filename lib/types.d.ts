export interface ISchedulerEditorSchema {
    id: string;
    title: string;
    dtStart: Date;
    dtEnd: Date;
    frequency: Frequency;
    interval: number;
    count: number;
    until?: Date;
    byDay: string;
    byMonth: number;
    byMonthDay: number;
    bySetPos: number;
    wkst: Weekday;
}
export interface IRrule {
    dtStart: Date;
    dtEnd: Date;
    weekStartOn: Weekday;
    frequency: Frequency;
    interval: number;
    count?: number;
    until?: Date;
    bySecond?: number;
    byMinute?: number;
    byHour?: number;
    byDay?: string;
    byMonth?: number;
    byMonthDay?: number;
    byYearDay?: number;
    bySetPos?: number;
}
export interface IRuleExtended extends IRrule {
    count: number;
    startRangePeriod: Date;
    endRangePeriodOrUntil: Date;
    secondsDuration: number;
    hasErrors: boolean;
    errorMessages: string;
    eventsCount: number;
    startIndexCount: number;
    firstEventInRangePeriod: Date;
}
export declare enum Frequency {
    NEVER = "NEVER",
    YEARLY = "YEARLY",
    MONTHLY = "MONTHLY",
    WEEKLY = "WEEKLY",
    DAILY = "DAILY",
    HOURLY = "HOURLY",
    MINUTELY = "MINUTELY",
    SECONDLY = "SECONDLY"
}
export declare enum Weekday {
    Sunday = "SU",
    Monday = "MO",
    Tuesday = "TU",
    Wednesday = "WE",
    Thursday = "TH",
    Friday = "FR",
    Saturday = "SA"
}
export declare const rRuleDefault: IRrule;
export declare const rRuleFields: {
    RRule: string;
    frequency: string;
    dtStart: string;
    dtEnd: string;
    weekStartOn: string;
    interval: string;
    count: string;
    until: string;
    bySetPos: string;
    byMinute: string;
    byHour: string;
    byDay: string;
    byMonthDay: string;
    byMonth: string;
    byYearDay: string;
};
