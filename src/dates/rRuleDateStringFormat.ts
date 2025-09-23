import isDate from './isDate'

/**
 * Converts a Date object to RRule date string format (YYYYMMDDTHHMMSSZ)
 * @param date - The date to convert
 * @param utc - Whether to use UTC time (default: true)
 * @returns RRule formatted date string
 * @example
 * toRRuleDateString(new Date('2022-12-15T15:20:30.000Z')) // '20221215T152030Z'
 */
export const toRRuleDateString = (date: Date, utc = true): string => {
    if (utc) {
        return [
            date.getUTCFullYear().toString().padStart(4, '0'),
            (date.getUTCMonth() + 1).toString().padStart(2, '0'),
            date.getUTCDate().toString().padStart(2, '0'),
            'T',
            date.getUTCHours().toString().padStart(2, '0'),
            date.getUTCMinutes().toString().padStart(2, '0'),
            date.getUTCSeconds().toString().padStart(2, '0'),
            'Z',
        ].join('')
    }

    return [
        date.getFullYear().toString().padStart(4, '0'),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0'),
        'T',
        date.getHours().toString().padStart(2, '0'),
        date.getMinutes().toString().padStart(2, '0'),
        date.getSeconds().toString().padStart(2, '0'),
    ].join('')
}

const errorString = 'Invalid fromRruleDateStringToDate'

export const fromRruleDateStringToDate = (dtString: string): Date => {
    //only 1000-1999/2000-1999 years
    //months 01 to 12
    //days 01 to 31
    //hours 01 to 23
    //minutes 01 to 59
    //seconds 01 to 59
    //milliseconds not implemented

    const rRuleDateStringFormat =
        /^([12]\d{3})(0[1-9]|1[0-2])((0[1-9])|([1-2][0-9])|(3[01]))T([01]\d|2[0-3])(0\d|[1-5]\d)(0\d|[1-5]\d)?([0-9]+)Z$/

    //validation
    //example: '20221215T152030Z or '20221215T1520300000Z''

    const match = dtString.match(rRuleDateStringFormat)

    if (!match || match === null) {
        throw new Error(errorString)
    }

    const year = dtString.substring(0, 4)
    const month = dtString.substring(4, 6)
    const day = dtString.substring(6, 8)
    const hour = dtString.substring(9, 11)
    const minute = dtString.substring(11, 13)
    const second = dtString.substring(13, 15)

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`

    const result = new Date(isoString)

    if (!isDate(result)) {
        throw new Error(errorString)
    }

    return result
}
