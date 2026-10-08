import { describe, expect, it } from 'vitest'
import { monthIndex, purchase } from '../test/factories'
import {
  describeSchedule,
  getSchedule,
  monthTotal,
  paymentsInMonth,
} from './schedule'

const jan = monthIndex(2026, 1)

describe('getSchedule', () => {
  const p = purchase({ amount: 100, installments: 3, date: '2026-01-20' })

  it('splits cents evenly and puts the leftover in the last payment', () => {
    const s = getSchedule(p, jan)
    expect(s.cents).toBe(10000)
    expect(s.base).toBe(3333)
    expect(s.last).toBe(3334)
    expect(s.firstMonth).toBe(jan + 1)
    expect(s.lastMonth).toBe(jan + 3)
  })

  it('charges nothing in the purchase month', () => {
    const s = getSchedule(p, jan)
    expect(s.status).toBe('new')
    expect(s.due).toBe(0)
    expect(s.paidCount).toBe(0)
    expect(s.remaining).toBe(10000)
  })

  it('tracks progress while paying', () => {
    const s = getSchedule(p, jan + 2)
    expect(s.status).toBe('active')
    expect(s.due).toBe(3333)
    expect(s.paidCount).toBe(2)
    expect(s.paid).toBe(6666)
    expect(s.remaining).toBe(3334)
    expect(s.progress).toBeCloseTo(0.6666)
  })

  it('charges the last payment with the leftover cents', () => {
    const s = getSchedule(p, jan + 3)
    expect(s.status).toBe('last')
    expect(s.due).toBe(3334)
    expect(s.paid).toBe(10000)
    expect(s.remaining).toBe(0)
  })

  it('knows months before and after the schedule', () => {
    expect(getSchedule(p, jan - 1).status).toBe('future')
    expect(getSchedule(p, jan - 1).paid).toBe(0)
    const done = getSchedule(p, jan + 4)
    expect(done.status).toBe('done')
    expect(done.due).toBe(0)
    expect(done.progress).toBe(1)
  })

  it('handles a single payment', () => {
    const s = getSchedule({ ...p, installments: 1 }, jan + 1)
    expect(s.status).toBe('last')
    expect(s.due).toBe(10000)
  })
})

describe('monthly totals', () => {
  const phone = purchase({ id: 'a', amount: 1200, installments: 12 })
  const tv = purchase({
    id: 'b',
    amount: 600,
    installments: 3,
    date: '2026-02-01',
  })

  it('adds the payments due in a month', () => {
    expect(monthTotal([phone, tv], jan)).toBe(0)
    expect(monthTotal([phone, tv], jan + 1)).toBe(10000)
    expect(monthTotal([phone, tv], jan + 2)).toBe(30000)
  })

  it('lists payments of a month, biggest first', () => {
    const rows = paymentsInMonth([phone, tv], jan + 2)
    expect(rows.map((r) => r.purchase.id)).toEqual(['b', 'a'])
  })
})

describe('describeSchedule', () => {
  const format = (cents: number) => `$${(cents / 100).toFixed(2)}`

  it('is empty while inputs are invalid', () => {
    expect(
      describeSchedule(
        { amount: 0, installments: 3, date: '2026-01-01' },
        format,
      ),
    ).toBe('')
    expect(
      describeSchedule(
        { amount: 10, installments: 0, date: '2026-01-01' },
        format,
      ),
    ).toBe('')
    expect(
      describeSchedule({ amount: 10, installments: 3, date: '' }, format),
    ).toBe('')
  })

  it('describes one payment', () => {
    expect(
      describeSchedule(
        { amount: 50, installments: 1, date: '2026-12-10' },
        format,
      ),
    ).toBe('One payment of $50.00 in January 2027.')
  })

  it('mentions an uneven last payment', () => {
    expect(
      describeSchedule(
        { amount: 100, installments: 3, date: '2026-01-10' },
        format,
      ),
    ).toBe(
      '3 payments of $33.33 (last one $33.34). First payment in February 2026, last in April 2026.',
    )
  })
})
