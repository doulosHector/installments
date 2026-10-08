import { describe, expect, it } from 'vitest'
import { monthIndex, purchase } from '../test/factories'
import { lastPaymentMonth, projectMonths } from './projection'

describe('projectMonths', () => {
  const jan = monthIndex(2026, 1)
  const purchases = [
    purchase({ amount: 300, installments: 3, date: '2026-01-10' }),
    purchase({ amount: 200, installments: 2, date: '2026-02-10' }),
  ]

  it('projects totals and changes for the next months', () => {
    const p = projectMonths(purchases, jan, 4)
    expect(p.current).toBe(0)
    expect(p.months.map((m) => m.total)).toEqual([10000, 20000, 20000, 0])
    expect(p.months.map((m) => m.delta)).toEqual([10000, 10000, 0, -20000])
    expect(p.sum).toBe(50000)
    expect(p.max).toBe(20000)
    expect(p.lastPaymentMonth).toBe(jan + 3)
  })

  it('keeps a minimum max of 1 for the bars', () => {
    expect(projectMonths([], jan, 2).max).toBe(1)
  })

  it('returns 0 as last payment month with no purchases', () => {
    expect(lastPaymentMonth([])).toBe(0)
  })
})
