import type { Cents, MonthIndex, Purchase } from '../types'
import { monthTotal, paymentsInMonth, type ScheduledPurchase } from './schedule'

export interface MonthSummary {
  /** Purchases charged this month, biggest payment first. */
  payments: ScheduledPurchase[]
  total: Cents
  /** Change against the previous month's total. */
  delta: Cents
  /** How many purchases make their last payment this month. */
  endingCount: number
}

export const monthSummary = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): MonthSummary => {
  const payments = paymentsInMonth(purchases, month)
  const total = payments.reduce((sum, row) => sum + row.schedule.due, 0)
  return {
    payments,
    total,
    delta: total - monthTotal(purchases, month - 1),
    endingCount: payments.filter((row) => row.schedule.status === 'last')
      .length,
  }
}
