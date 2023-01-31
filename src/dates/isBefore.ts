import dayjs from 'dayjs'

//todo test
export const isBefore = (date1: Date, date2: Date): boolean => {
    return dayjs(date1).isBefore(dayjs(date2)) // default milliseconds
}
