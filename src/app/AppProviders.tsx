import { useCallback, type ReactNode } from 'react'
import { InstallmentsProvider } from '../context/installments'
import { ToastProvider, useToast } from '../context/toast'
import { UiProvider } from '../context/ui'

function PersistedInstallmentsProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const handleSaveError = useCallback(
    () => showToast('Could not save on this device'),
    [showToast],
  )
  return (
    <InstallmentsProvider onSaveError={handleSaveError}>
      {children}
    </InstallmentsProvider>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PersistedInstallmentsProvider>
        <UiProvider>{children}</UiProvider>
      </PersistedInstallmentsProvider>
    </ToastProvider>
  )
}
