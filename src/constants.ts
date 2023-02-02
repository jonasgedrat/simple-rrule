/**
 * Days in 1 year
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occures every 4 years, except for years that are divisable by 100 and not divisable by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 *
 * @name daysInYear
 * @constant
 * @type {number}
 * @default
 */
export const daysInYear: number = 365.2425

/**
 * Maximum allowed time.
 *
 * @name maxTime
 * @constant
 * @type {number}
 * @default
 */
export const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000

export const millisecondsInWeek = 604800000
export const millisecondsInDay = 86400000
export const millisecondsInMinute = 60000
export const millisecondsInHour = 3600000
export const millisecondsInSecond = 1000

export const minTime = -maxTime

export const minutesInYear = 525600
export const minutesInMonth = 43200
export const minutesInDay = 1440
export const minutesInHour = 60

export const secondsInHour = 3600
export const secondsInMinute = 60
export const secondsInDay = secondsInHour * 24
export const secondsInWeek = secondsInDay * 7
export const secondsInYear = secondsInDay * daysInYear
export const secondsInMonth = secondsInYear / 12
