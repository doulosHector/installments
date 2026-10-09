import type { ComponentType } from 'react'
import { AppHeader, BottomNav } from '../components/layout'
import { useInstallments } from '../context/installments'
import { useUi } from '../context/ui'
import { ProjectionView } from '../features/projection'
import { PurchasesView } from '../features/purchases'
import { SettingsView } from '../features/settings'
import { useDocumentTheme } from '../hooks/useDocumentTheme'
import type { View } from '../types'
import { AppProviders } from './AppProviders'
import { SheetOutlet } from './SheetOutlet'

const VIEWS: Record<View, ComponentType> = {
  purchases: PurchasesView,
  projection: ProjectionView,
  settings: SettingsView,
}

function AppShell() {
  const { state } = useInstallments()
  const { view } = useUi()
  useDocumentTheme(state.settings.theme)
  const ActiveView = VIEWS[view]

  return (
    <>
      <div className="app">
        <AppHeader />
        <main>
          <ActiveView />
        </main>
      </div>
      <BottomNav />
      <SheetOutlet />
    </>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  )
}
