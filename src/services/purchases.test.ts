import { describe, expect, it } from 'vitest'
import { monthIndex, purchase } from '../test/factories'
import type { PurchaseFilters } from '../types'
import { allTags, filterPurchases } from './purchases'

const jun = monthIndex(2026, 6)
const filters = (
  overrides: Partial<PurchaseFilters> = {},
): PurchaseFilters => ({
  status: 'active',
  tag: null,
  query: '',
  ...overrides,
})

const done = purchase({
  id: 'done',
  description: 'Sofa',
  installments: 3,
  date: '2026-01-10',
  tags: ['home'],
})
const nearlyDone = purchase({
  id: 'nearly',
  description: 'Laptop',
  installments: 6,
  date: '2026-01-10',
  tags: ['Tech'],
})
const long = purchase({
  id: 'long',
  description: 'Car',
  installments: 24,
  date: '2026-01-10',
})
const future = purchase({ id: 'future', date: '2026-08-01' })
const all = [done, nearlyDone, long, future]

describe('allTags', () => {
  it('lists unique tags alphabetically', () => {
    expect(
      allTags([purchase({ tags: ['b', 'a'] }), purchase({ tags: ['a', 'c'] })]),
    ).toEqual(['a', 'b', 'c'])
  })
})

describe('filterPurchases', () => {
  const ids = (f: Partial<PurchaseFilters>) =>
    filterPurchases(all, jun, filters(f)).map((r) => r.purchase.id)

  it('shows current purchases, fewest payments left first', () => {
    expect(ids({})).toEqual(['nearly', 'long'])
  })

  it('shows finished ones and, with All, future ones too', () => {
    expect(ids({ status: 'done' })).toEqual(['done'])
    expect(ids({ status: 'all' })).toContain('future')
  })

  it('filters by tag and by text in the description or tags', () => {
    expect(ids({ status: 'done', tag: 'home' })).toEqual(['done'])
    expect(ids({ query: 'lap' })).toEqual(['nearly'])
    expect(ids({ query: 'tech' })).toEqual(['nearly'])
  })

  it('keeps future purchases under All, whatever the tag or text', () => {
    // Same as the original app: future purchases skip the other filters.
    expect(ids({ status: 'all', query: 'zzz' })).toEqual(['future'])
  })
})
