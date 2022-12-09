import { IRrule, Weekday } from './types';
export declare const parseRecurrenceFromString: (recurrenceString: string | undefined, weekStartsOn: Weekday) => IRrule | undefined;
