import { IRrule, IRuleExtended } from './types';
export interface IDateEvents {
    date: Date;
    index: number;
}
export interface IExpandResult {
    r: IRuleExtended;
    events: IDateEvents[];
}
export declare const expandRRule: (rRule: IRrule, startRangePeriod: Date, endRangePeriod: Date, minimalSecondsDuration?: number) => IExpandResult;
