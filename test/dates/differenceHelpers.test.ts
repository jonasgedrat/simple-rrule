import {
    addDays,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addWeeks,
    addYears,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
} from '../../src/dates'

const _d = new Date('2020-01-01T00:00:00.000Z')

test('differenceInDays', () => {
    expect(differenceInDays(addDays(_d, 7), _d)).toEqual(7)
})

test('differenceInDays', () => {
    expect(differenceInDays(addDays(_d, 7), _d)).toEqual(7)
})

test('differenceInHours', () => {
    expect(differenceInHours(addHours(_d, 7), _d)).toEqual(7)
})

test('differenceInMinutes', () => {
    expect(differenceInMinutes(addMinutes(_d, 7), _d)).toEqual(7)
})
test('differenceInMonths', () => {
    expect(differenceInMonths(addMonths(_d, 7), _d)).toEqual(7)
})

test('differenceInSeconds', () => {
    expect(differenceInSeconds(addSeconds(_d, 7), _d)).toEqual(7)
})

test('differenceInWeeks', () => {
    expect(differenceInWeeks(addWeeks(_d, 7), _d)).toEqual(7)
})

test('differenceInYears', () => {
    expect(differenceInYears(addYears(_d, 7), _d)).toEqual(7)
})
