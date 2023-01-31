import dayjs from 'dayjs'

//todo test
export const getWeekDayName = (date: Date) => {
    return dayjs(date).format('dd').toLocaleUpperCase()
}
