import { createContext, type Dispatch } from 'react'
import type { InstallmentsState, Purchase, ThemePreference } from '../../types'
import { createId } from '../../utils/id'
import type { InstallmentsAction, PurchaseInput } from './installmentsReducer'

export const createInstallmentsActions = (
  dispatch: Dispatch<InstallmentsAction>,
) => ({
  addPurchase: (input: PurchaseInput): void =>
    dispatch({
      type: 'purchaseAdded',
      purchase: { ...input, id: createId(), createdAt: Date.now() },
    }),
  updatePurchase: (id: string, changes: PurchaseInput): void =>
    dispatch({ type: 'purchaseUpdated', id, changes }),
  deletePurchase: (id: string): void =>
    dispatch({ type: 'purchaseDeleted', id }),
  restorePurchase: (purchase: Purchase, index: number): void =>
    dispatch({ type: 'purchaseRestored', purchase, index }),
  replacePurchases: (purchases: Purchase[]): void =>
    dispatch({ type: 'purchasesReplaced', purchases }),

  setTheme: (theme: ThemePreference): void =>
    dispatch({ type: 'themeChanged', theme }),
  setCurrency: (currency: string): void =>
    dispatch({ type: 'currencyChanged', currency }),
})

export type InstallmentsActions = ReturnType<typeof createInstallmentsActions>

export interface InstallmentsContextValue {
  state: InstallmentsState
  actions: InstallmentsActions
}

export const InstallmentsContext =
  createContext<InstallmentsContextValue | null>(null)
