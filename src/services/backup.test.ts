import { describe, expect, it } from 'vitest'
import { installmentsState, monthIndex, purchase } from '../test/factories'
import { exportBackup, exportCsv, mergePurchases, parseBackup } from './backup'

describe('exportBackup', () => {
  it('wraps settings and purchases with app metadata', () => {
    const state = installmentsState({ purchases: [purchase({ id: 'p1' })] })
    const backup = exportBackup(state, new Date('2026-10-08T12:00:00Z'))
    expect(backup).toMatchObject({
      app: 'installments-tracker',
      version: 1,
      exportedAt: '2026-10-08T12:00:00.000Z',
      settings: state.settings,
    })
    expect(backup.purchases).toHaveLength(1)
  })
})

describe('exportCsv', () => {
  it('writes one row per purchase with its progress', () => {
    const csv = exportCsv(
      [
        purchase({
          description: 'TV, 55"',
          amount: 100,
          installments: 3,
          date: '2026-01-10',
          tags: ['home', 'tech'],
        }),
      ],
      monthIndex(2026, 2),
    )
    const [head, row] = csv.split('\n')
    expect(head).toBe(
      'description,purchase_date,total_amount,payments,monthly_payment,current_payment,progress_percent,paid,remaining,tags',
    )
    expect(row).toBe(
      '"TV, 55""",2026-01-10,100.00,3,33.33,1,33,33.33,66.67,home; tech',
    )
  })
})

describe('parseBackup', () => {
  const valid = {
    description: 'A',
    amount: 10,
    date: '2026-01-01',
    installments: 2,
  }

  it('rejects files that are not usable', () => {
    expect(parseBackup('{oops')).toEqual({
      ok: false,
      error: 'This file is not valid JSON',
    })
    expect(parseBackup('{"items":[]}')).toEqual({
      ok: false,
      error: 'No purchases found in this file',
    })
    expect(parseBackup('[{"description":"x"}]')).toEqual({
      ok: false,
      error: 'No valid purchases found in this file',
    })
  })

  it('reads an exported backup with settings and counts skipped entries', () => {
    const result = parseBackup(
      JSON.stringify({
        settings: { theme: 'dark', currency: 'EUR' },
        purchases: [valid, { description: 'bad' }],
      }),
    )
    expect(result.ok && result.backup.purchases).toHaveLength(1)
    expect(result.ok && result.backup.skipped).toBe(1)
    expect(result.ok && result.backup.settings?.currency).toBe('EUR')
  })

  it('reads a plain list without settings', () => {
    const result = parseBackup(JSON.stringify([valid]))
    expect(result.ok && result.backup.settings).toBeNull()
  })
})

describe('mergePurchases', () => {
  it('adds new purchases and replaces ones with the same id', () => {
    const current = [
      purchase({ id: 'a', description: 'Old' }),
      purchase({ id: 'b' }),
    ]
    const result = mergePurchases(current, [
      purchase({ id: 'a', description: 'New' }),
      purchase({ id: 'c' }),
    ])
    expect(result.added).toBe(1)
    expect(result.updated).toBe(1)
    expect(result.purchases.map((p) => p.id)).toEqual(['a', 'b', 'c'])
    expect(result.purchases[0].description).toBe('New')
  })
})
