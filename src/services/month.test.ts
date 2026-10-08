import { describe, expect, it } from 'vitest'
import { monthIndex, purchase } from '../test/factories'
import { monthSummary } from './month'

describe('monthSummary', () => {
  const mar = monthIndex(2026, 3)
  const ending = purchase({
    id: 'ending',
    amount: 300,
    installments: 2,
    date: '2026-01-05',
  })
  const ongoing = purchase({
    id: 'ongoing',
    amount: 1200,
    installments: 12,
    date: '2026-01-05',
  })
  const fresh = purchase({ id: 'fresh', date: '2026-03-02' })

  it('totals the payments due and compares with last month', () => {
    const s = monthSummary([ending, ongoing, fresh], mar)
    expect(s.payments.map((r) => r.purchase.id)).toEqual(['ending', 'ongoing'])
    expect(s.total).toBe(15000 + 10000)
    expect(s.delta).toBe(0)
    expect(s.endingCount).toBe(1)
    expect(s.starting.map((r) => r.purchase.id)).toEqual(['fresh'])
  })

  it('reports the change when a purchase ends', () => {
    const s = monthSummary([ending, ongoing], mar + 1)
    expect(s.total).toBe(10000)
    expect(s.delta).toBe(-15000)
    expect(s.endingCount).toBe(0)
  })
})
