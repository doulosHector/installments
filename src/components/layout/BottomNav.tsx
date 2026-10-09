import type { UiIconName } from '../../constants/icons'
import { useUi } from '../../context/ui'
import type { View } from '../../types'
import { Icon } from '../ui'
import './BottomNav.css'

interface Tab {
  view: View
  icon: UiIconName
  label: string
}

const LEFT: Tab[] = [
  { view: 'purchases', icon: 'purchases', label: 'Purchases' },
  { view: 'projection', icon: 'projection', label: 'Projection' },
]

const RIGHT: Tab[] = [{ view: 'settings', icon: 'settings', label: 'Settings' }]

/** Tabs with the add-purchase button in the middle. */
export function BottomNav() {
  const { view, setView, openSheet } = useUi()

  const tab = (t: Tab) => (
    <button
      key={t.view}
      type="button"
      aria-label={t.label}
      aria-current={view === t.view ? 'page' : undefined}
      onClick={() => setView(t.view)}
    >
      <Icon name={t.icon} />
      {t.label}
    </button>
  )

  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-in">
        {LEFT.map(tab)}
        <div>
          <button
            type="button"
            className="add"
            aria-label="Add purchase"
            onClick={() =>
              openSheet({ type: 'purchaseForm', purchaseId: null })
            }
          >
            <Icon name="add" strokeWidth={2.2} />
          </button>
        </div>
        {RIGHT.map(tab)}
      </div>
    </nav>
  )
}
