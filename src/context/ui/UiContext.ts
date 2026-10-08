import { createContext } from 'react'
import type { MonthIndex, PurchaseFilters, SheetState, View } from '../../types'

export interface ActiveSheet {
  state: SheetState
  /** Changes on every open so sheet forms start from a clean state. */
  key: number
}

export interface UiContextValue {
  view: View
  setView: (view: View) => void

  /** The real current month, fixed when the app starts. */
  today: MonthIndex
  /** Month currently being browsed. */
  month: MonthIndex
  /** Changes the browsed month and collapses the projection detail. */
  setMonth: (month: MonthIndex) => void

  /** Projection month whose purchases are expanded, if any. */
  openMonth: MonthIndex | null
  toggleOpenMonth: (month: MonthIndex) => void

  filters: PurchaseFilters
  updateFilters: (changes: Partial<PurchaseFilters>) => void

  sheet: ActiveSheet | null
  isSheetOpen: boolean
  openSheet: (sheet: SheetState) => void
  closeSheet: () => void
}

export const UiContext = createContext<UiContextValue | null>(null)
