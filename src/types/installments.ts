export type ThemePreference = 'system' | 'light' | 'dark'

/** A calendar date as `YYYY-MM-DD`. */
export type DateKey = string

/** Months counted from year 0: `year * 12 + month` (month 0–11). */
export type MonthIndex = number

/** Amount of money in cents. */
export type Cents = number

export interface Purchase {
  id: string
  description: string
  /** Total price, in currency units with up to 2 decimals. */
  amount: number
  /** Purchase date. Its month is payment 0 (nothing charged yet). */
  date: DateKey
  /** Number of monthly payments, 1–360. */
  installments: number
  tags: string[]
  createdAt: number
}

export interface Settings {
  theme: ThemePreference
  /** ISO 4217 code. Only changes how amounts are shown. */
  currency: string
}

export interface InstallmentsState {
  settings: Settings
  purchases: Purchase[]
}

/**
 * Where a purchase stands in a given month:
 * - `future`: bought after that month
 * - `new`: bought that month, first payment is next month
 * - `active`: paying, more payments left after this one
 * - `last`: paying the last payment
 * - `done`: paid off before that month
 */
export type PaymentStatus = 'future' | 'new' | 'active' | 'last' | 'done'

/** Payment schedule of a purchase, seen from one month. */
export interface Schedule {
  /** Total in cents. */
  cents: Cents
  /** Regular payment. */
  base: Cents
  /** Last payment: the regular one plus any leftover cents. */
  last: Cents
  /** Months elapsed since the purchase month. */
  elapsed: number
  /** Payments made up to and including this month. */
  paidCount: number
  /** Number of payments. */
  count: number
  paid: Cents
  remaining: Cents
  /** Payment charged in this month. */
  due: Cents
  /** Share already paid, 0–1. */
  progress: number
  status: PaymentStatus
  firstMonth: MonthIndex
  lastMonth: MonthIndex
}
