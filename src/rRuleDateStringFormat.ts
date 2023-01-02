export const toRRuleDateString = (_date: Date, utc = true): string => {
    return [
        _date.getUTCFullYear().toString().padStart(4, '0'),
        (_date.getUTCMonth() + 1).toString().padStart(2, '0'),
        _date.getUTCDate().toString().padStart(2, '0'),
        'T',
        _date.getUTCHours().toString().padStart(2, '0'),
        _date.getUTCMinutes().toString().padStart(2, '0'),
        _date.getUTCSeconds().toString().padStart(2, '0'),
        utc ? 'Z' : '',
    ].join('')
}

export const fromRruleDateStringToDate = (dtString: string): Date => {
    //only 1000-1999/2000-1999 years
    //months 01 to 12
    //days 01 to 31
    //hours 01 to 23
    //minutes 01 to 59
    //seconds 01 to 59
    //milliseconds not implemented

    //validation
    const re =
        /^([12]\d{3})(0[1-9]|1[0-2])((0[1-9])|([1-2][0-9])|(3[01]))T([01]\d|2[0-3])(0\d|[1-5]\d)(0\d|[1-5]\d)?([0-9]+)Z$/

    const match = dtString.match(re)
    if (!match)
        throw new Error(`Invalid fromRruleDateStringToDate value: ${dtString}`)

    //example: '20221215T152030Z or '20221215T1520300000Z''
    const year = dtString.substring(0, 4)
    const month = dtString.substring(4, 6)
    const day = dtString.substring(6, 8)
    const hour = dtString.substring(9, 11)
    const minute = dtString.substring(11, 13)
    const second = dtString.substring(13, 15)

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`

    const result = new Date(isoString)

    //console.log(result, isoString)

    return result
}
