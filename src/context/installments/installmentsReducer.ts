import type { InstallmentsState, Purchase, ThemePreference } from '../../types'

/** Fields of a purchase the user can edit. */
export type PurchaseInput = Omit<Purchase, 'id' | 'createdAt'>

export type InstallmentsAction =
  | { type: 'purchaseAdded'; purchase: Purchase }
  | { type: 'purchaseUpdated'; id: string; changes: PurchaseInput }
  | { type: 'purchaseDeleted'; id: string }
  /** Puts a deleted purchase back at its old position (undo). */
  | { type: 'purchaseRestored'; purchase: Purchase; index: number }
  /** Replaces the whole list: import, delete all and its undo. */
  | { type: 'purchasesReplaced'; purchases: Purchase[] }
  | { type: 'themeChanged'; theme: ThemePreference }
  | { type: 'currencyChanged'; currency: string }

export function installmentsReducer(
  state: InstallmentsState,
  action: InstallmentsAction,
): InstallmentsState {
  switch (action.type) {
    case 'purchaseAdded':
      return { ...state, purchases: [...state.purchases, action.purchase] }
    case 'purchaseUpdated':
      return {
        ...state,
        purchases: state.purchases.map((p) =>
          p.id === action.id ? { ...p, ...action.changes } : p,
        ),
      }
    case 'purchaseDeleted':
      return {
        ...state,
        purchases: state.purchases.filter((p) => p.id !== action.id),
      }
    case 'purchaseRestored': {
      const purchases = [...state.purchases]
      purchases.splice(
        Math.min(action.index, purchases.length),
        0,
        action.purchase,
      )
      return { ...state, purchases }
    }
    case 'purchasesReplaced':
      return { ...state, purchases: action.purchases }
    case 'themeChanged':
      return { ...state, settings: { ...state.settings, theme: action.theme } }
    case 'currencyChanged':
      return {
        ...state,
        settings: { ...state.settings, currency: action.currency },
      }
  }
}
