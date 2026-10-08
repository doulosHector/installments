import { useContext } from 'react'
import {
  InstallmentsContext,
  type InstallmentsContextValue,
} from './InstallmentsContext'

export function useInstallments(): InstallmentsContextValue {
  const context = useContext(InstallmentsContext)
  if (!context)
    throw new Error('useInstallments must be used within InstallmentsProvider')
  return context
}
