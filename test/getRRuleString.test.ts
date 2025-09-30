import { describe, it, expect } from 'vitest'
import { getRRuleString } from '../src/getRrule'
import { toRRuleDateString } from '../src/dates'
import { rRuleDefaultValues } from '../src/validators/rRule'

let d = {
    ...rRuleDefaultValues,
    dtStart: '2022-12-15T00:00:00.000Z',
    dtEnd: '2022-12-15T01:00:00.000Z',
}

export const dtStart = `DTSTART:${toRRuleDateString(
    d.dtStart
)}\nDTEND:${toRRuleDateString(d.dtEnd)}\n`

describe('getRRuleString', () => {
    describe('Basic functionality', () => {
        it('should generate correct RRule strings', () => {
            const expectations: [string, string][] = [
                [
                    getRRuleString({
                        ...d,
                        frequency: 'WEEKLY',
                        until: new Date('2022-12-20T01:00:00.000Z'),
                    }),
                    `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221220T010000Z;WKST=SU`,
                ],
                [
                    getRRuleString({
                        ...d,
                        frequency: 'DAILY',
                    }),
                    `${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;WKST=SU`,
                ],
                [
                    getRRuleString({
                        ...d,
                        interval: 3,
                        frequency: 'WEEKLY',
                    }),
                    `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=3;WKST=SU`,
                ],
                [
                    getRRuleString({
                        ...d,
                        byDay: 'SU,MO,FR',
                        frequency: 'WEEKLY',
                    }),
                    `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SU,MO,FR;WKST=SU`,
                ],
                [
                    getRRuleString({
                        ...d,
                        frequency: 'YEARLY',
                        wkst: 'SA',
                    }),
                    `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;WKST=SA`,
                ],
            ]

            expectations.map((i) => {
                expect(i[0]).toEqual(i[1])
            })
        })

        it('should return empty string for NEVER frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'NEVER',
            })
            expect(result).toBe('')
        })
    })

    describe('Frequency types', () => {
        it('should handle YEARLY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                byMonth: 6,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=6;BYMONTH=6;WKST=SU`
            )
        })

        it('should handle MONTHLY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                byMonthDay: 15,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15;BYMONTHDAY=15;WKST=SU`
            )
        })

        it('should handle WEEKLY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                byDay: 'MO,WE,FR',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;WKST=SU`
            )
        })

        it('should handle DAILY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'DAILY',
                interval: 2,
            })
            expect(result).toBe(`${dtStart}RRULE:FREQ=DAILY;INTERVAL=2;WKST=SU`)
        })

        it('should handle HOURLY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'HOURLY',
                interval: 4,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=HOURLY;INTERVAL=4;WKST=SU`
            )
        })

        it('should handle MINUTELY frequency', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MINUTELY',
                interval: 30,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MINUTELY;INTERVAL=30;WKST=SU`
            )
        })
    })

    describe('Count and Until parameters', () => {
        it('should include COUNT when specified', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'DAILY',
                count: 10,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;COUNT=10;WKST=SU`
            )
        })

        it('should include UNTIL when specified', () => {
            const until = new Date('2023-01-15T12:00:00.000Z')
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                until,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20230115T120000Z;WKST=SU`
            )
        })

        it('should not include COUNT when it is 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'DAILY',
                count: 0,
            })
            expect(result).toBe(`${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;WKST=SU`)
        })
    })

    describe('BySetPos parameter', () => {
        it('should include BYSETPOS when not zero', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                bySetPos: 2,
                byDay: 'MO',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=2;BYDAY=MO;WKST=SU`
            )
        })

        it('should include negative BYSETPOS', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                bySetPos: -1,
                byDay: 'FR',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=-1;BYDAY=FR;WKST=SU`
            )
        })

        it('should not include BYSETPOS when zero', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                bySetPos: 0,
                byDay: 'TU',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=TU;WKST=SU`
            )
        })
    })

    describe('ByDay parameter', () => {
        it('should include BYDAY when specified', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                byDay: 'MO,TU,WE,TH,FR',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR;WKST=SU`
            )
        })

        it('should not include BYDAY when empty string', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                byDay: '',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=SU`
            )
        })

        it('should handle single day in BYDAY', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                byDay: 'SA',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SA;WKST=SU`
            )
        })
    })

    describe('ByMonth parameter', () => {
        it('should include BYMONTH for YEARLY frequency when byMonth > 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                byMonth: 12,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=12;BYMONTH=12;WKST=SU`
            )
        })

        it('should not include BYMONTH for YEARLY frequency when byMonth is 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                byMonth: 0,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;WKST=SU`
            )
        })

        it('should include BYMONTH for non-YEARLY frequency when byMonth is not 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                byMonth: 3,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTH=3;WKST=SU`
            )
        })
    })

    describe('ByMonthDay parameter', () => {
        it('should include BYMONTHDAY for MONTHLY frequency when byMonthDay > 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                byMonthDay: 25,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=25;BYMONTHDAY=25;WKST=SU`
            )
        })

        it('should not include BYMONTHDAY for MONTHLY frequency when byMonthDay is 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                byMonthDay: 0,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;WKST=SU`
            )
        })

        it('should include BYMONTHDAY for non-MONTHLY frequency when byMonthDay is not 0', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                byMonthDay: 1,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTHDAY=1;WKST=SU`
            )
        })
    })

    describe('Week start parameter', () => {
        it('should include WKST when specified', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                wkst: 'MO',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO`
            )
        })

        it('should handle all valid weekday values for WKST', () => {
            const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
            weekdays.forEach((wkst) => {
                const result = getRRuleString({
                    ...d,
                    frequency: 'WEEKLY',
                    wkst: wkst as any,
                })
                expect(result).toBe(
                    `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=${wkst}`
                )
            })
        })
    })

    describe('Complex combinations', () => {
        it('should handle complex YEARLY rule with multiple parameters', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                byMonth: 6,
                byDay: 'MO',
                bySetPos: 2,
                count: 5,
                wkst: 'MO',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;COUNT=5;BYMONTH=6;BYSETPOS=2;BYDAY=MO;BYMONTH=6;WKST=MO`
            )
        })

        it('should handle complex MONTHLY rule with multiple parameters', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'MONTHLY',
                byMonthDay: 15,
                byDay: 'WE',
                bySetPos: -1,
                interval: 2,
                until: new Date('2023-12-31T23:59:59.000Z'),
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=2;UNTIL=20231231T235959Z;BYMONTHDAY=15;BYSETPOS=-1;BYDAY=WE;BYMONTHDAY=15;WKST=SU`
            )
        })

        it('should handle WEEKLY rule with interval and multiple days', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'WEEKLY',
                interval: 3,
                byDay: 'MO,WE,FR',
                count: 20,
                wkst: 'MO',
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=WEEKLY;INTERVAL=3;COUNT=20;BYDAY=MO,WE,FR;WKST=MO`
            )
        })
    })

    describe('Edge cases', () => {
        it('should handle minimum interval value', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'DAILY',
                interval: 1,
            })
            expect(result).toBe(`${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;WKST=SU`)
        })

        it('should handle large interval value', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                interval: 100,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=100;WKST=SU`
            )
        })

        it('should handle maximum count value', () => {
            const result = getRRuleString({
                ...d,
                frequency: 'DAILY',
                count: 999,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=DAILY;INTERVAL=1;COUNT=999;WKST=SU`
            )
        })

        it('should handle far future until date', () => {
            const until = new Date('2099-12-31T23:59:59.000Z')
            const result = getRRuleString({
                ...d,
                frequency: 'YEARLY',
                until,
            })
            expect(result).toBe(
                `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;UNTIL=20991231T235959Z;WKST=SU`
            )
        })

        it('should handle all valid bySetPos values', () => {
            const bySetPosValues = [-1, 1, 2, 3, 4]
            bySetPosValues.forEach((pos) => {
                const result = getRRuleString({
                    ...d,
                    frequency: 'MONTHLY',
                    bySetPos: pos as any,
                    byDay: 'MO',
                })
                expect(result).toBe(
                    `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYSETPOS=${pos};BYDAY=MO;WKST=SU`
                )
            })
        })

        it('should handle all valid byMonth values', () => {
            for (let month = 1; month <= 12; month++) {
                const result = getRRuleString({
                    ...d,
                    frequency: 'YEARLY',
                    byMonth: month as any,
                })
                // Note: The function duplicates BYMONTH for YEARLY frequency
                expect(result).toBe(
                    `${dtStart}RRULE:FREQ=YEARLY;INTERVAL=1;BYMONTH=${month};BYMONTH=${month};WKST=SU`
                )
            }
        })

        it('should handle all valid byMonthDay values', () => {
            const testDays = [1, 15, 28, 31]
            testDays.forEach((day) => {
                const result = getRRuleString({
                    ...d,
                    frequency: 'MONTHLY',
                    byMonthDay: day as any,
                })
                expect(result).toBe(
                    `${dtStart}RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=${day};BYMONTHDAY=${day};WKST=SU`
                )
            })
        })
    })

    describe('Date formatting', () => {
        it('should format dates correctly in different timezones', () => {
            const dtStart = new Date('2022-06-15T14:30:45.123Z')
            const dtEnd = new Date('2022-06-15T15:30:45.123Z')
            const result = getRRuleString({
                ...d,
                dtStart,
                dtEnd,
                frequency: 'DAILY',
            })

            const expectedStart = `DTSTART:${toRRuleDateString(dtStart)}\nDTEND:${toRRuleDateString(dtEnd)}\n`
            expect(result).toBe(
                `${expectedStart}RRULE:FREQ=DAILY;INTERVAL=1;WKST=SU`
            )
        })

        it('should handle leap year dates', () => {
            const dtStart = new Date('2024-02-29T12:00:00.000Z')
            const dtEnd = new Date('2024-02-29T13:00:00.000Z')
            const result = getRRuleString({
                ...d,
                dtStart,
                dtEnd,
                frequency: 'YEARLY',
            })

            const expectedStart = `DTSTART:${toRRuleDateString(dtStart)}\nDTEND:${toRRuleDateString(dtEnd)}\n`
            expect(result).toBe(
                `${expectedStart}RRULE:FREQ=YEARLY;INTERVAL=1;WKST=SU`
            )
        })
    })
})
