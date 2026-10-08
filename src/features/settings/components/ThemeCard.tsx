import { useInstallments } from '../../../context/installments'
import type { ThemePreference } from '../../../types'

const OPTIONS: [ThemePreference, string][] = [
  ['system', 'System'],
  ['light', 'Light'],
  ['dark', 'Dark'],
]

export function ThemeCard() {
  const { state, actions } = useInstallments()
  return (
    <div className="group">
      <h3>Theme</h3>
      <p>Choose how the app looks.</p>
      <div className="seg-ctl" role="group" aria-label="Theme">
        {OPTIONS.map(([theme, label]) => (
          <button
            key={theme}
            type="button"
            aria-pressed={state.settings.theme === theme}
            onClick={() => actions.setTheme(theme)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
