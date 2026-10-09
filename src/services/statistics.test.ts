import { describe, expect, it } from 'vitest'
import { monthIndex, purchase } from '../test/factories'
import { computeStatistics } from './statistics'

const oct = monthIndex(2026, 10)

const phone = purchase({
  id: 'phone',
  amount: 300,
  installments: 3,
  date: '2026-08-10',
  tags: ['tech'],
})
const bike = purchase({
  id: 'bike',
  amount: 2400,
  installments: 24,
  date: '2026-05-20',
  tags: ['sport', 'tech'],
})
const rent = purchase({
  id: 'rent',
  amount: 600,
  installments: 6,
  date: '2026-09-01',
})
const sofa = purchase({
  id: 'sofa',
  amount: 900,
  installments: 3,
  date: '2026-01-10',
})
const later = purchase({ id: 'later', date: '2026-12-01' })
const all = [phone, bike, rent, sofa, later]

describe('computeStatistics', () => {
  const stats = computeStatistics(all, oct)

  it('sums current purchases: paid, total and what is left', () => {
    // Phone 2 of 3, bike 5 of 24, rent 1 of 6.
    expect(stats.current).toMatchObject({
      count: 3,
      paid: 20000 + 50000 + 10000,
      total: 30000 + 240000 + 60000,
      remaining: 10000 + 190000 + 50000,
    })
    expect(stats.current.progress).toBeCloseTo(80000 / 330000)
  })

  it('counts bought and finished purchases, ignoring future ones', () => {
    expect(stats.bought).toEqual({ count: 4, total: 420000 })
    expect(stats.finishedCount).toBe(1)
  })

  it('averages the next 12 months and finds the highest one', () => {
    // Nov: phone 100 + bike 100 + rent 100 = 300, then later starts in Jan.
    expect(stats.peak).toEqual({ month: oct + 1, total: 30000 })
    expect(stats.averageAhead).toBeGreaterThan(0)
  })

  it('splits this month by tag, counting a purchase in each of its tags', () => {
    expect(stats.paymentCount).toBe(3)
    expect(stats.byTag).toEqual([
      { tag: 'tech', due: 20000, count: 2 },
      { tag: 'sport', due: 10000, count: 1 },
      { tag: null, due: 10000, count: 1 },
    ])
  })

  it('lists purchases ending within 3 months and what they free up', () => {
    expect(stats.endingBy).toBe(oct + 2)
    expect(stats.ending.map((e) => e.purchase.id)).toEqual(['phone'])
    expect(stats.freed).toBe(10000)
  })

  it('has no peak when nothing is due ahead', () => {
    expect(computeStatistics([sofa], oct).peak).toBeNull()
  })
})
