import dayjs from 'dayjs'

//todo conferir se fim do mes esta correto
//todo test

export const setByMonthByDay = (
    date: Date,
    day: number,
    month: number
): Date => {
    return dayjs(date)
        .set('day', day)
        .set('month', month - 1)
        .toDate()
}
