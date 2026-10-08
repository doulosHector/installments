import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { loadState, saveState } from '../../services/storage'
import {
  InstallmentsContext,
  createInstallmentsActions,
} from './InstallmentsContext'
import { installmentsReducer } from './installmentsReducer'

interface InstallmentsProviderProps {
  children: ReactNode
  /** Called when the state could not be written to localStorage. */
  onSaveError?: () => void
}

export function InstallmentsProvider({
  children,
  onSaveError,
}: InstallmentsProviderProps) {
  const [state, dispatch] = useReducer(
    installmentsReducer,
    undefined,
    loadState,
  )

  useEffect(() => {
    if (!saveState(state)) onSaveError?.()
  }, [state, onSaveError])

  const actions = useMemo(() => createInstallmentsActions(dispatch), [])
  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <InstallmentsContext value={value}>{children}</InstallmentsContext>
}
