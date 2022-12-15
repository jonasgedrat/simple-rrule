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

export const fromRruleDateStringToDate = (until: string): Date => {
    const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/
    const bits = re.exec(until)

    if (!bits) throw new Error(`Invalid UNTIL value: ${until}`)

    return new Date(
        Date.UTC(
            parseInt(bits[1], 10),
            parseInt(bits[2], 10) - 1,
            parseInt(bits[3], 10),
            parseInt(bits[5], 10) || 0,
            parseInt(bits[6], 10) || 0,
            parseInt(bits[7], 10) || 0
        )
    )
}
