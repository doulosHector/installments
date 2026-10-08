import { useUi } from '../../context/ui'
import { monthYear } from '../../utils/month'
import { Icon } from '../ui'
import './AppHeader.css'

/** Month switcher, or the page title on Settings. */
export function AppHeader() {
  const { view, month, today, setMonth } = useUi()

  if (view === 'settings')
    return (
      <header className="top">
        <h1 className="ptitle">Settings</h1>
      </header>
    )

  const away = month !== today
  return (
    <header className="top">
      <div className="mswitch">
        <button
          type="button"
          className="mbtn"
          aria-label="Previous month"
          onClick={() => setMonth(month - 1)}
        >
          <Icon name="chevronLeft" size={20} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="mlabel"
          aria-label={away ? 'Go back to this month' : 'Current month'}
          onClick={() => setMonth(today)}
        >
          {monthYear(month)}
          {away && <small>Back to today</small>}
        </button>
        <button
          type="button"
          className="mbtn"
          aria-label="Next month"
          onClick={() => setMonth(month + 1)}
        >
          <Icon name="chevronRight" size={20} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
