export const getWeekDayName = (date: Date) => {
    const result = date
        .toLocaleDateString('en-US', { weekday: 'short' })
        .toUpperCase()
        .substring(0, 2)
    return result
}
