import { LOCALE } from '../constants/locale'
import type { DateKey, MonthIndex } from '../types'

export const toMonthIndex = (date: Date): MonthIndex =>
  date.getFullYear() * 12 + date.getMonth()

export const currentMonthIndex = (): MonthIndex => toMonthIndex(new Date())

/** Month of a `YYYY-MM-DD` date. */
export const monthOfDate = (key: DateKey): MonthIndex => {
  const [y, m] = key.split('-').map(Number)
  return y * 12 + (m - 1)
}

export const yearOf = (month: MonthIndex): number => Math.floor(month / 12)

const firstDay = (month: MonthIndex) => new Date(yearOf(month), month % 12, 1)

/** e.g. `October`. */
export const monthLong = (month: MonthIndex): string =>
  firstDay(month).toLocaleString(LOCALE, { month: 'long' })

/** e.g. `Oct`. */
export const monthShort = (month: MonthIndex): string =>
  firstDay(month).toLocaleString(LOCALE, { month: 'short' })

/** e.g. `October 2026`. */
export const monthYear = (month: MonthIndex): string =>
  `${monthLong(month)} ${yearOf(month)}`

/** e.g. `Oct 2026`. */
export const monthShortYear = (month: MonthIndex): string =>
  `${monthShort(month)} ${yearOf(month)}`
