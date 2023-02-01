import { getWeekDayName } from '../../src/dates'

test('getWeekDayName', () => {
    expect(getWeekDayName(new Date('2020-01-06'))).toEqual('SU')
    expect(getWeekDayName(new Date('2020-01-07'))).toEqual('MO')
    expect(getWeekDayName(new Date('2020-01-01'))).toEqual('TU')
    expect(getWeekDayName(new Date('2020-01-02'))).toEqual('WE')
    expect(getWeekDayName(new Date('2020-01-03'))).toEqual('TH')
    expect(getWeekDayName(new Date('2020-01-04'))).toEqual('FR')
    expect(getWeekDayName(new Date('2020-01-05'))).toEqual('SA')
})
