import type { Cents, DateKey, MonthIndex, Purchase, Schedule } from '../types'
import { monthOfDate, monthYear } from '../utils/month'

type ScheduleInput = Pick<Purchase, 'amount' | 'installments' | 'date'>

/**
 * Payment schedule of a purchase, seen from `month`.
 * The purchase month is payment 0 (nothing charged); payment 1 is the next
 * month. Cents are split evenly and any leftover cents go into the last one.
 */
export const getSchedule = (
  purchase: ScheduleInput,
  month: MonthIndex,
): Schedule => {
  const cents = Math.round(purchase.amount * 100)
  const count = purchase.installments
  const base = Math.floor(cents / count)
  const last = cents - base * (count - 1)
  const start = monthOfDate(purchase.date)
  const elapsed = month - start
  const paidCount = Math.max(0, Math.min(elapsed, count))
  const paid = paidCount >= count ? cents : base * paidCount
  const due =
    elapsed >= 1 && elapsed <= count ? (elapsed === count ? last : base) : 0
  const status =
    elapsed < 0
      ? 'future'
      : elapsed === 0
        ? 'new'
        : elapsed < count
          ? 'active'
          : elapsed === count
            ? 'last'
            : 'done'
  return {
    cents,
    base,
    last,
    elapsed,
    paidCount,
    count,
    paid,
    remaining: cents - paid,
    due,
    progress: cents ? paid / cents : 0,
    status,
    firstMonth: start + 1,
    lastMonth: start + count,
  }
}

/** Sum of every payment charged in `month`. */
export const monthTotal = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): Cents => purchases.reduce((sum, p) => sum + getSchedule(p, month).due, 0)

/** A purchase together with its schedule in one month. */
export interface ScheduledPurchase {
  purchase: Purchase
  schedule: Schedule
}

export const scheduleAll = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): ScheduledPurchase[] =>
  purchases.map((purchase) => ({
    purchase,
    schedule: getSchedule(purchase, month),
  }))

/** Purchases charged in `month`, biggest payment first. */
export const paymentsInMonth = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): ScheduledPurchase[] =>
  scheduleAll(purchases, month)
    .filter((row) => row.schedule.due > 0)
    .sort((a, b) => b.schedule.due - a.schedule.due)

/**
 * One-line summary of a new purchase's payments, shown while filling the
 * form. Empty when the inputs are not valid yet.
 */
export const describeSchedule = (
  input: { amount: number; installments: number; date: DateKey },
  format: (cents: Cents) => string,
): string => {
  const { amount, installments: n, date } = input
  if (!(amount > 0 && n >= 1 && n <= 360 && /^\d{4}-\d{2}-\d{2}$/.test(date)))
    return ''
  const { cents, base, last } = getSchedule(input, monthOfDate(date))
  const start = monthOfDate(date)
  if (n === 1)
    return `One payment of ${format(cents)} in ${monthYear(start + 1)}.`
  return (
    `${n} payments of ${format(base)}` +
    (last !== base ? ` (last one ${format(last)})` : '') +
    `. First payment in ${monthYear(start + 1)}, last in ${monthYear(start + n)}.`
  )
}
