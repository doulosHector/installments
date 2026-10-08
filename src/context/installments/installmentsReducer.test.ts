import { describe, expect, it } from 'vitest'
import { installmentsState, purchase } from '../../test/factories'
import { installmentsReducer } from './installmentsReducer'

describe('installmentsReducer', () => {
  const a = purchase({ id: 'a' })
  const b = purchase({ id: 'b' })
  const c = purchase({ id: 'c' })
  const state = installmentsState({ purchases: [a, b, c] })

  it('adds a purchase at the end', () => {
    const d = purchase({ id: 'd' })
    const next = installmentsReducer(state, {
      type: 'purchaseAdded',
      purchase: d,
    })
    expect(next.purchases.map((p) => p.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(state.purchases).toHaveLength(3)
  })

  it('updates the editable fields, keeping id and creation time', () => {
    const next = installmentsReducer(state, {
      type: 'purchaseUpdated',
      id: 'b',
      changes: {
        description: 'Edited',
        amount: 5,
        date: '2026-05-01',
        installments: 2,
        tags: ['x'],
      },
    })
    expect(next.purchases[1]).toEqual({
      ...b,
      description: 'Edited',
      amount: 5,
      date: '2026-05-01',
      installments: 2,
      tags: ['x'],
    })
    expect(next.purchases[0]).toBe(a)
  })

  it('deletes and restores a purchase at its old position', () => {
    const deleted = installmentsReducer(state, {
      type: 'purchaseDeleted',
      id: 'b',
    })
    expect(deleted.purchases.map((p) => p.id)).toEqual(['a', 'c'])
    const restored = installmentsReducer(deleted, {
      type: 'purchaseRestored',
      purchase: b,
      index: 1,
    })
    expect(restored.purchases.map((p) => p.id)).toEqual(['a', 'b', 'c'])
  })

  it('restores at the end when the list got shorter', () => {
    const next = installmentsReducer(installmentsState(), {
      type: 'purchaseRestored',
      purchase: b,
      index: 5,
    })
    expect(next.purchases).toEqual([b])
  })

  it('replaces all purchases', () => {
    const next = installmentsReducer(state, {
      type: 'purchasesReplaced',
      purchases: [],
    })
    expect(next.purchases).toEqual([])
  })

  it('changes theme and currency', () => {
    const themed = installmentsReducer(state, {
      type: 'themeChanged',
      theme: 'dark',
    })
    const next = installmentsReducer(themed, {
      type: 'currencyChanged',
      currency: 'EUR',
    })
    expect(next.settings).toEqual({ theme: 'dark', currency: 'EUR' })
  })
})
