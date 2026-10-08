import { LOCALE } from '../constants/locale'
import type { Cents } from '../types'

const formatters = new Map<string, Intl.NumberFormat>()

const formatterFor = (currency: string): Intl.NumberFormat => {
  let formatter = formatters.get(currency)
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
      })
    } catch {
      // Older engines without `narrowSymbol`.
      formatter = new Intl.NumberFormat(LOCALE, { style: 'currency', currency })
    }
    formatters.set(currency, formatter)
  }
  return formatter
}

export interface MoneyFormat {
  /** e.g. `$1,234.50`. */
  format: (cents: Cents) => string
  /** e.g. `+$10.00` or `−$10.00` (with a real minus sign). */
  signed: (cents: Cents) => string
  /** Whole part (with symbol) and decimal part, to style the cents apart. */
  parts: (cents: Cents) => { main: string; fraction: string }
}

export const moneyFormat = (currency: string): MoneyFormat => {
  const formatter = formatterFor(currency)
  const format = (cents: Cents) => formatter.format(cents / 100)
  return {
    format,
    signed: (cents) => (cents > 0 ? '+' : '−') + format(Math.abs(cents)),
    parts: (cents) => {
      let main = ''
      let fraction = ''
      let inFraction = false
      for (const part of formatter.formatToParts(cents / 100)) {
        if (part.type === 'decimal') inFraction = true
        if (inFraction) fraction += part.value
        else main += part.value
      }
      return { main, fraction }
    },
  }
}
