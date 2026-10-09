import type { Cents, MonthIndex, Purchase } from '../types'
import { projectMonths } from './projection'
import { getSchedule, paymentsInMonth } from './schedule'

/** Months ahead used for the monthly average and the highest month. */
export const STATS_AHEAD_MONTHS = 12
/** Window, counting the browsed month, for "ending soon". */
export const ENDING_WINDOW_MONTHS = 3

export interface TagShare {
  /** `null` groups the payments without tags. */
  tag: string | null
  due: Cents
  count: number
}

export interface EndingPurchase {
  purchase: Purchase
  lastMonth: MonthIndex
  /** Regular payment that stops after the last one. */
  monthly: Cents
}

export interface Statistics {
  /** Purchases not paid off yet (bought up to the browsed month). */
  current: {
    count: number
    paid: Cents
    total: Cents
    remaining: Cents
    /** Share already paid, 0–1. */
    progress: number
  }
  /** Every purchase made up to the browsed month. */
  bought: { count: number; total: Cents }
  finishedCount: number
  /** Average monthly total over the next 12 months. */
  averageAhead: Cents
  /** Highest monthly total over the next 12 months, if any. */
  peak: { month: MonthIndex; total: Cents } | null
  /** Number of payments due in the browsed month. */
  paymentCount: number
  /**
   * Payments of the browsed month by tag, biggest first. A purchase with
   * several tags counts in each of them.
   */
  byTag: TagShare[]
  /** Last month counted as "ending soon". */
  endingBy: MonthIndex
  /** Purchases whose last payment is within the window, soonest first. */
  ending: EndingPurchase[]
  /** Sum of the monthly payments that stop within the window. */
  freed: Cents
}

const tagShares = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): TagShare[] => {
  const shares = new Map<string | null, TagShare>()
  for (const { purchase, schedule } of paymentsInMonth(purchases, month)) {
    const tags = purchase.tags.length ? purchase.tags : [null]
    for (const tag of tags) {
      const share = shares.get(tag) ?? { tag, due: 0, count: 0 }
      share.due += schedule.due
      share.count++
      shares.set(tag, share)
    }
  }
  return [...shares.values()].sort((a, b) => b.due - a.due)
}

/** The figures shown on the Statistics view, as of `month`. */
export const computeStatistics = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): Statistics => {
  const current = { count: 0, paid: 0, total: 0, remaining: 0, progress: 0 }
  const bought = { count: 0, total: 0 }
  let finishedCount = 0
  const endingBy = month + ENDING_WINDOW_MONTHS - 1
  const ending: EndingPurchase[] = []

  for (const purchase of purchases) {
    const s = getSchedule(purchase, month)
    if (s.status === 'future') continue
    bought.count++
    bought.total += s.cents
    if (s.status === 'done') {
      finishedCount++
      continue
    }
    current.count++
    current.paid += s.paid
    current.total += s.cents
    if (s.lastMonth <= endingBy)
      ending.push({ purchase, lastMonth: s.lastMonth, monthly: s.base })
  }
  current.remaining = current.total - current.paid
  current.progress = current.total ? current.paid / current.total : 0
  ending.sort((a, b) => a.lastMonth - b.lastMonth || b.monthly - a.monthly)

  const projection = projectMonths(purchases, month, STATS_AHEAD_MONTHS)
  const peak = projection.months.reduce<Statistics['peak']>(
    (best, m) => (m.total > (best?.total ?? 0) ? m : best),
    null,
  )

  return {
    current,
    bought,
    finishedCount,
    averageAhead: Math.round(projection.sum / STATS_AHEAD_MONTHS),
    peak: peak && { month: peak.month, total: peak.total },
    paymentCount: paymentsInMonth(purchases, month).length,
    byTag: tagShares(purchases, month),
    endingBy,
    ending,
    freed: ending.reduce((sum, e) => sum + e.monthly, 0),
  }
}
