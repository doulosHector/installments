import { LOCALE } from '../constants/locale'
import type { DateKey } from '../types'

const pad = (n: number) => String(n).padStart(2, '0')

/** Local date as `YYYY-MM-DD`. */
export const toDateKey = (date: Date): DateKey =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const todayKey = (): DateKey => toDateKey(new Date())

export const isDateKey = (value: string): value is DateKey =>
  /^\d{4}-\d{2}-\d{2}$/.test(value)

/** e.g. `Oct 5, 2026`. */
export const formatDate = (key: DateKey): string => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
