import type { InstallmentsState, Purchase } from '../types'

export const purchase = (overrides: Partial<Purchase> = {}): Purchase => ({
  id: `p-${Math.random().toString(36).slice(2)}`,
  description: 'Phone',
  amount: 1200,
  date: '2026-01-15',
  installments: 12,
  tags: [],
  createdAt: 1,
  ...overrides,
})

export const installmentsState = (
  overrides: Partial<InstallmentsState> = {},
): InstallmentsState => ({
  settings: { theme: 'system', currency: 'MXN' },
  purchases: [],
  ...overrides,
})

/** Month index for a year and a 1-based month. */
export const monthIndex = (year: number, month: number) =>
  year * 12 + (month - 1)
