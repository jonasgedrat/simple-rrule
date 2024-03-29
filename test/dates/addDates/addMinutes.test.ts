import { addMinutes } from '../../../src/dates'

describe('addMinutes', () => {
    it('adds the given number of minutes', () => {
        const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
        expect(result).toEqual(new Date(2014, 6, 10, 12, 30))
    })

    it('add fractional number', () => {
        const result = addMinutes(new Date(2014, 0, 0, 0, 0), 30.5)
        expect(result).toEqual(new Date(2014, 0, 0, 0, 30, 30))
    })

    it('does not mutate the original date', () => {
        const date = new Date(2014, 6, 10, 12, 0)
        addMinutes(date, 25)
        expect(date).toEqual(new Date(2014, 6, 10, 12, 0))
    })

    it('returns `Invalid Date` if the given date is invalid', () => {
        const result: any = addMinutes(new Date(NaN), 30)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })

    it('returns `Invalid Date` if the given amount is NaN', () => {
        const result: any = addMinutes(new Date(2014, 6, 10, 12, 0), NaN)
        expect(result instanceof Date).toBeTruthy()
        expect(isNaN(result as any)).toBeTruthy()
    })
})
