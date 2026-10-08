import { CURRENCIES } from '../../../constants/currencies'
import { useInstallments } from '../../../context/installments'
import { useToast } from '../../../context/toast'

export function CurrencyCard() {
  const { state, actions } = useInstallments()
  const { showToast } = useToast()
  return (
    <div className="group">
      <h3>Currency</h3>
      <p>Only changes how amounts are shown.</p>
      <select
        aria-label="Currency"
        value={state.settings.currency}
        onChange={(event) => {
          actions.setCurrency(event.target.value)
          showToast('Currency changed')
        }}
      >
        {CURRENCIES.map(([code, name]) => (
          <option key={code} value={code}>
            {code}, {name}
          </option>
        ))}
      </select>
    </div>
  )
}
