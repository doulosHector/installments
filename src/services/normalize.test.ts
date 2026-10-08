import { describe, expect, it } from 'vitest'
import { cleanTags, normalizePurchase, normalizeState } from './normalize'

describe('cleanTags', () => {
  it('trims, de-duplicates ignoring case and limits tags', () => {
    expect(cleanTags([' a ', 'A', 'b', ''])).toEqual(['a', 'b'])
    expect(cleanTags('x; y | z, x')).toEqual(['x', 'y', 'z'])
    expect(
      cleanTags(Array.from({ length: 20 }, (_, i) => `t${i}`)),
    ).toHaveLength(12)
    expect(cleanTags(['x'.repeat(40)])[0]).toHaveLength(30)
    expect(cleanTags(undefined)).toEqual([])
  })
})

describe('normalizePurchase', () => {
  it('keeps a valid purchase', () => {
    expect(
      normalizePurchase({
        id: 'p1',
        description: ' Phone ',
        amount: 1200.456,
        date: '2026-01-15T10:00:00Z',
        installments: '12',
        tags: ['tech'],
        createdAt: 5,
      }),
    ).toEqual({
      id: 'p1',
      description: 'Phone',
      amount: 1200.46,
      date: '2026-01-15',
      installments: 12,
      tags: ['tech'],
      createdAt: 5,
    })
  })

  it('accepts the short names and text amounts, and creates an id', () => {
    const p = normalizePurchase({
      desc: 'TV',
      amount: '$1,500.00',
      n: 6,
      date: '2026-02-01',
    })
    expect(p).toMatchObject({
      description: 'TV',
      amount: 1500,
      installments: 6,
    })
    expect(p?.id).toBeTruthy()
  })

  it('rejects missing or wrong data', () => {
    const base = {
      description: 'X',
      amount: 1,
      installments: 1,
      date: '2026-01-01',
    }
    expect(normalizePurchase(null)).toBeNull()
    expect(normalizePurchase({ ...base, description: ' ' })).toBeNull()
    expect(normalizePurchase({ ...base, amount: 0 })).toBeNull()
    expect(normalizePurchase({ ...base, installments: 361 })).toBeNull()
    expect(normalizePurchase({ ...base, date: '01/01/2026' })).toBeNull()
  })
})

describe('normalizeState', () => {
  it('reads data saved by the original single-file app', () => {
    const state = normalizeState({
      version: 1,
      updatedAt: 99,
      settings: { theme: 'dark', currency: 'USD' },
      purchases: [
        {
          id: 'p1',
          description: 'A',
          amount: 10,
          date: '2026-01-01',
          installments: 2,
          tags: [],
          createdAt: 1,
        },
      ],
    })
    expect(state.settings).toEqual({ theme: 'dark', currency: 'USD' })
    expect(state.purchases).toHaveLength(1)
  })

  it('repairs bad settings and drops invalid purchases', () => {
    const state = normalizeState({
      settings: { theme: 'neon', currency: 'dollars' },
      purchases: [{ description: 'Bad' }],
    })
    expect(state.settings).toEqual({ theme: 'system', currency: 'MXN' })
    expect(state.purchases).toEqual([])
  })

  it('accepts a plain list of purchases or nothing at all', () => {
    expect(
      normalizeState([
        { description: 'A', amount: 1, installments: 1, date: '2026-01-01' },
      ]).purchases,
    ).toHaveLength(1)
    expect(normalizeState('garbage').purchases).toEqual([])
  })
})
