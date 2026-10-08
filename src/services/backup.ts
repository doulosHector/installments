import type {
  BackupParseResult,
  InstallmentsState,
  MonthIndex,
  Purchase,
} from '../types'
import { toCsv } from '../utils/csv'
import { normalizePurchases, normalizeState } from './normalize'
import { getSchedule } from './schedule'

/** Contents of an exported JSON backup. */
export const exportBackup = (state: InstallmentsState, now = new Date()) => ({
  app: 'installments-tracker',
  version: 1,
  exportedAt: now.toISOString(),
  settings: state.settings,
  purchases: state.purchases,
})

export const backupToJson = (state: InstallmentsState): string =>
  JSON.stringify(exportBackup(state), null, 2)

const CSV_HEADER = [
  'description',
  'purchase_date',
  'total_amount',
  'payments',
  'monthly_payment',
  'current_payment',
  'progress_percent',
  'paid',
  'remaining',
  'tags',
]

const units = (cents: number) => (cents / 100).toFixed(2)

/** Table of purchases with their progress as of `month`. */
export const exportCsv = (
  purchases: readonly Purchase[],
  month: MonthIndex,
): string =>
  toCsv([
    CSV_HEADER,
    ...purchases.map((p) => {
      const s = getSchedule(p, month)
      return [
        p.description,
        p.date,
        units(s.cents),
        s.count,
        units(s.base),
        s.paidCount,
        Math.round(s.progress * 100),
        units(s.paid),
        units(s.remaining),
        p.tags.join('; '),
      ]
    }),
  ])

/**
 * Reads a JSON backup: a file exported by the app (`{ purchases }`) or a
 * plain list of purchases. Invalid purchases are skipped and counted.
 */
export const parseBackup = (text: string): BackupParseResult => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'This file is not valid JSON' }
  }
  const isList = Array.isArray(parsed)
  const record =
    !isList && typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null
  const list = isList
    ? (parsed as unknown[])
    : Array.isArray(record?.purchases)
      ? (record.purchases as unknown[])
      : null
  if (!list) return { ok: false, error: 'No purchases found in this file' }
  const { purchases, skipped } = normalizePurchases(list)
  if (!purchases.length)
    return { ok: false, error: 'No valid purchases found in this file' }
  return {
    ok: true,
    backup: {
      purchases,
      skipped,
      settings: record?.settings ? normalizeState(record).settings : null,
    },
  }
}

/**
 * Adds imported purchases to the current ones. A purchase with an id that
 * already exists replaces it in place.
 */
export const mergePurchases = (
  current: readonly Purchase[],
  incoming: readonly Purchase[],
): { purchases: Purchase[]; added: number; updated: number } => {
  const purchases = [...current]
  const indexById = new Map(purchases.map((p, i) => [p.id, i]))
  let added = 0
  let updated = 0
  for (const p of incoming) {
    const index = indexById.get(p.id)
    if (index != null) {
      purchases[index] = p
      updated++
    } else {
      purchases.push(p)
      added++
    }
  }
  return { purchases, added, updated }
}
