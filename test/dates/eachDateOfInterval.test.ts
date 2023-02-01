import { eachDateOfInterval } from '../../src/dates'

const start = new Date('2020-01-01T00:00:00.000Z')
const end = new Date('2032-01-01T00:00:00.000Z')

test('Years eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'years', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2021-01-01T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2022-01-01T00:00:00.000Z'))
})

test('Months eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'months', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-02-01T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-03-01T00:00:00.000Z'))
})

test('Days eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'days', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-02T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-03T00:00:00.000Z'))
})

test('Weeks eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'weeks', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-08T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-15T00:00:00.000Z'))
})

test('Hours eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'hours', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T01:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T02:00:00.000Z'))
})

test('Minutes eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'minutes', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T00:01:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T00:02:00.000Z'))
})

test('Seconds eachDateOfInterval', () => {
    const dates = eachDateOfInterval(start, end, 'seconds', 1, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T00:00:01.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T00:00:02.000Z'))
})

test('Years eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'years', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2023-01-01T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2026-01-01T00:00:00.000Z'))
})

test('Months eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'months', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-04-01T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-07-01T00:00:00.000Z'))
})

test('Days eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'days', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-04T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-07T00:00:00.000Z'))
})

test('Weeks eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'weeks', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-22T00:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-02-12T00:00:00.000Z'))
})

test('Hours eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'hours', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T03:00:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T06:00:00.000Z'))
})

test('Minutes eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'minutes', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T00:03:00.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T00:06:00.000Z'))
})

test('Seconds eachDateOfInterval with Step', () => {
    const dates = eachDateOfInterval(start, end, 'seconds', 3, 3)
    expect(dates.length).toEqual(3)
    expect(dates[0]).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    expect(dates[1]).toEqual(new Date('2020-01-01T00:00:03.000Z'))
    expect(dates[2]).toEqual(new Date('2020-01-01T00:00:06.000Z'))
})
