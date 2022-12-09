export const isBetween = (
    value: string | number,
    start: number,
    end: number
): number | undefined => {
    const _v = Number(value)
    if ((_v - start) * (_v - end) <= 0) {
        return _v
    }
    return undefined
}
