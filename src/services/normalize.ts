import { THEMES } from '../constants/theme'
import type { InstallmentsState, Purchase, ThemePreference } from '../types'
import { isDateKey } from '../utils/date'
import { createId } from '../utils/id'
import { parseAmount, roundMoney } from '../utils/number'
import { createDefaultState } from './defaults'

export const MAX_INSTALLMENTS = 360
export const MAX_TAGS = 12
export const MAX_TAG_LENGTH = 30
export const MAX_DESCRIPTION_LENGTH = 120

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Trims, shortens and de-duplicates tags (case-insensitive). */
export const cleanTags = (raw: unknown): string[] => {
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? raw.split(/[,;|]/)
      : []
  const seen = new Set<string>()
  const tags: string[] = []
  for (const value of list) {
    const tag = String(value).trim().slice(0, MAX_TAG_LENGTH)
    const key = tag.toLowerCase()
    if (tag && !seen.has(key)) {
      seen.add(key)
      tags.push(tag)
    }
  }
  return tags.slice(0, MAX_TAGS)
}

/**
 * Validates one purchase from untrusted data. Accepts the short field names
 * `desc` and `n` too. Returns `null` when a required field is missing or wrong.
 */
export const normalizePurchase = (raw: unknown): Purchase | null => {
  if (!isRecord(raw)) return null
  const description = String(raw.description ?? raw.desc ?? '')
    .trim()
    .slice(0, MAX_DESCRIPTION_LENGTH)
  const amount =
    typeof raw.amount === 'number'
      ? raw.amount
      : parseAmount(String(raw.amount ?? ''))
  const installments = parseInt(String(raw.installments ?? raw.n), 10)
  const date = String(raw.date ?? '').slice(0, 10)
  if (
    !description ||
    !(amount > 0) ||
    !(installments >= 1 && installments <= MAX_INSTALLMENTS) ||
    !isDateKey(date)
  ) {
    return null
  }
  return {
    id: raw.id != null && raw.id !== '' ? String(raw.id) : createId(),
    description,
    amount: roundMoney(amount),
    date,
    installments,
    tags: cleanTags(raw.tags),
    createdAt: Number(raw.createdAt) || Date.now(),
  }
}

/** Valid purchases of a list, and how many entries were dropped. */
export const normalizePurchases = (
  list: unknown[],
): { purchases: Purchase[]; skipped: number } => {
  const purchases: Purchase[] = []
  for (const raw of list) {
    const purchase = normalizePurchase(raw)
    if (purchase) purchases.push(purchase)
  }
  return { purchases, skipped: list.length - purchases.length }
}

const isTheme = (value: unknown): value is ThemePreference =>
  THEMES.includes(value as ThemePreference)

const isCurrencyCode = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Z]{3}$/.test(value)

/**
 * Validates untrusted data (localStorage or a backup) into a state.
 * Accepts `{ settings, purchases }` or a plain list of purchases. Bad
 * settings fall back to the defaults and invalid purchases are dropped.
 */
export const normalizeState = (raw: unknown): InstallmentsState => {
  const state = createDefaultState()
  if (isRecord(raw) && isRecord(raw.settings)) {
    const { theme, currency } = raw.settings
    if (isTheme(theme)) state.settings.theme = theme
    if (isCurrencyCode(currency)) state.settings.currency = currency
  }
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.purchases)
      ? raw.purchases
      : []
  state.purchases = normalizePurchases(list).purchases
  return state
}
