import { addMonths, setDayOfMonthClamped } from './dates'
import { Weekday, BySetPos, WeekdayValuesList } from './types'
import { isBySetPosValid, isWeekDayValid } from './validators/util'

export const getBySetPos = (
  currDate: Date,
  byDay: Weekday,
  bySetPos: BySetPos,
  maxCount: number,
  currentCount: number
): Date | undefined => {
  if (maxCount > 0 && currentCount === maxCount) return undefined

  if (!isWeekDayValid(byDay)) {
    throw new Error(`Invalid byDay value: ${byDay}`)
  }
  isBySetPosValid(bySetPos)

  const firstDayOfMonth = new Date(currDate)
  firstDayOfMonth.setDate(1)

  const month = firstDayOfMonth.getMonth()
  const weekDaysInMonth = []
  const weekDayIndex = WeekdayValuesList.findIndex((x) => x === byDay)

  //find the first Weekday in month
  while (firstDayOfMonth.getDay() !== weekDayIndex) {
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
  }

  //get array of all WeekDays / month
  while (firstDayOfMonth.getMonth() === month) {
    weekDaysInMonth.push(new Date(firstDayOfMonth.getTime()))
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 7)
  }

  const result =
    bySetPos < 0
      ? weekDaysInMonth[weekDaysInMonth.length + bySetPos] //conta a partir do fim: -1 = ultimo, -2 = penultimo...
      : weekDaysInMonth[bySetPos - 1]

  return result
}

export const eachMonthOfIntervalWithTime = (
  startDate: Date,
  endDate: Date,
  byMonthDay: number = 0,
  maxCount: number = 0
) => {
  const endTime = endDate.getTime()
  const dates = []

  // Throw an exception if start date is after end date or if any date is `Invalid Date`
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError('Invalid interval')
  }

  const hasByMonthDay = byMonthDay > 0 && byMonthDay <= 31

  let count = 0

  // A base de incremento de mes e sempre `startDate` (nunca uma data ja
  // ajustada por byMonthDay), para que o dia desejado nao "vaze" para o
  // mes seguinte quando o mes de startDate nao comporta esse dia
  // (ex: startDate em fevereiro e byMonthDay=31).
  let currentDate = hasByMonthDay
    ? setDayOfMonthClamped(startDate, byMonthDay)
    : new Date(startDate)

  while (currentDate.getTime() <= endTime) {
    if (currentDate.getTime() >= startDate.getTime()) {
      dates.push(currentDate)
    }

    count++

    if (maxCount > 0 && count >= maxCount) {
      break
    }

    const nextMonthBase = addMonths(startDate, count)
    currentDate = hasByMonthDay
      ? setDayOfMonthClamped(nextMonthBase, byMonthDay)
      : nextMonthBase
  }

  return dates
}

export const eachYearOfIntervalWithTime = (
  startDate: Date,
  endDate: Date,
  byMonthDay: number = 0
) => {
  const endTime = endDate.getTime()
  const dates = []

  // Throw an exception if start date is after end date or if any date is `Invalid Date`
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError('Invalid interval')
  }

  const hasByMonthDay = byMonthDay > 0 && byMonthDay <= 31

  let count = 0

  // Mesma logica de eachMonthOfIntervalWithTime: incrementa sempre a
  // partir de `startDate` e so entao aplica o clamp do dia desejado,
  // para nao "vazar" o dia para o mes/ano seguinte.
  let currentDate = hasByMonthDay
    ? setDayOfMonthClamped(startDate, byMonthDay)
    : new Date(startDate)

  while (currentDate.getTime() <= endTime) {
    if (currentDate.getTime() >= startDate.getTime()) {
      dates.push(currentDate)
    }
    count++

    const nextYearBase = addMonths(startDate, count * 12)
    currentDate = hasByMonthDay
      ? setDayOfMonthClamped(nextYearBase, byMonthDay)
      : nextYearBase
  }

  return dates
}

export const removeLastPipe = (str: string) => {
  if (str.substring(str.length - 1) === '|') {
    str = str.substring(0, str.length - 1)
  }
  return str
}
