import dayjs from 'dayjs'

export const getWeekDayName = (date: Date) => {
    return dayjs(date).format('dd').toLocaleUpperCase()
}
