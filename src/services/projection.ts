import type { Cents, MonthIndex, Purchase } from '../types'
import { monthOfDate } from '../utils/month'
import { monthTotal } from './schedule'

export interface ProjectedMonth {
  month: MonthIndex
  total: Cents
  /** Change against the month before it. */
  delta: Cents
}

export interface Projection {
  /** Total of the browsed month. */
  current: Cents
  months: ProjectedMonth[]
  /** Biggest total, including the current month (at least 1, for bars). */
  max: Cents
  /** Sum of the projected months. */
  sum: Cents
  /** Month of the last payment of all purchases. */
  lastPaymentMonth: MonthIndex
}

/** Monthly totals for the `count` months after `month`. */
export const projectMonths = (
  purchases: readonly Purchase[],
  month: MonthIndex,
  count = 12,
): Projection => {
  const current = monthTotal(purchases, month)
  const months: ProjectedMonth[] = []
  let previous = current
  let max = current
  let sum = 0
  for (let i = 1; i <= count; i++) {
    const total = monthTotal(purchases, month + i)
    months.push({ month: month + i, total, delta: total - previous })
    previous = total
    sum += total
    max = Math.max(max, total)
  }
  return {
    current,
    months,
    max: Math.max(max, 1),
    sum,
    lastPaymentMonth: lastPaymentMonth(purchases),
  }
}

/** Month of the last payment over all purchases (0 when there are none). */
export const lastPaymentMonth = (purchases: readonly Purchase[]): MonthIndex =>
  purchases.reduce(
    (last, p) => Math.max(last, monthOfDate(p.date) + p.installments),
    0,
  )
