import { createContext } from 'react'
import type { ToastAction } from '../../components/ui'

export interface ToastContextValue {
  /** Shows a message; with an action (e.g. Undo) it stays longer. */
  showToast: (message: string, action?: ToastAction) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
