import type { Cents, MonthIndex, Purchase, PurchaseFilters } from '../types'
import { getSchedule, scheduleAll, type ScheduledPurchase } from './schedule'

/** Every tag in use, sorted alphabetically. */
export const allTags = (purchases: readonly Purchase[]): string[] => {
  const tags = new Set<string>()
  for (const p of purchases) for (const tag of p.tags) tags.add(tag)
  return [...tags].sort((a, b) => a.localeCompare(b))
}

const matches = (
  { purchase, schedule }: ScheduledPurchase,
  { status, tag, query }: PurchaseFilters,
): boolean => {
  if (schedule.status === 'future') return status === 'all'
  if (status === 'active' && schedule.status === 'done') return false
  if (status === 'done' && schedule.status !== 'done') return false
  if (tag && !purchase.tags.includes(tag)) return false
  const q = query.trim().toLowerCase()
  if (
    q &&
    !purchase.description.toLowerCase().includes(q) &&
    !purchase.tags.some((t) => t.toLowerCase().includes(q))
  ) {
    return false
  }
  return true
}

/**
 * Purchases for the Purchases view, seen from `month`. Paid-off ones go
 * most recently finished first; the rest by fewest payments left, then by
 * biggest payment.
 */
export const filterPurchases = (
  purchases: readonly Purchase[],
  month: MonthIndex,
  filters: PurchaseFilters,
): ScheduledPurchase[] =>
  scheduleAll(purchases, month)
    .filter((row) => matches(row, filters))
    .sort((a, b) => {
      if (a.schedule.status === 'done' || b.schedule.status === 'done')
        return b.schedule.lastMonth - a.schedule.lastMonth
      return (
        a.schedule.count -
          a.schedule.paidCount -
          (b.schedule.count - b.schedule.paidCount) ||
        b.schedule.due - a.schedule.due
      )
    })

/** Money still owed after `month`, over the purchases not yet paid off. */
export const remainingAfter = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): { remaining: Cents; count: number } => {
  let remaining = 0
  let count = 0
  for (const p of purchases) {
    const s = getSchedule(p, month)
    if (s.status !== 'done' && s.status !== 'future') {
      remaining += s.remaining
      count++
    }
  }
  return { remaining, count }
}
