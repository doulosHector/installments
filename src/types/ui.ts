import type { ParsedBackup } from './backup'

export type View = 'month' | 'purchases' | 'projection' | 'settings'

/** Which purchases the Purchases view lists. */
export type StatusFilter = 'active' | 'done' | 'all'

export interface PurchaseFilters {
  status: StatusFilter
  /** Selected tag, or `null` for all tags. */
  tag: string | null
  query: string
}

/** Every bottom sheet the app can show, with the data it needs. */
export type SheetState =
  | { type: 'purchaseForm'; purchaseId: string | null }
  | { type: 'importGuide' }
  | { type: 'importConfirm'; backup: ParsedBackup }
