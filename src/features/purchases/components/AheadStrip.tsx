import { useInstallments } from '../../../context/installments'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import { monthTotal } from '../../../services/schedule'
import { monthShortYear } from '../../../utils/month'

const MONTHS_AHEAD = [1, 2, 3]

/** Totals of the next three months; each opens the projection. */
export function AheadStrip() {
  const { purchases } = useInstallments().state
  const { month, setView } = useUi()
  const money = useMoney()

  return (
    <div className="ahead">
      {MONTHS_AHEAD.map((offset) => (
        <button
          key={offset}
          type="button"
          onClick={() => setView('projection')}
        >
          <span>{monthShortYear(month + offset)}</span>
          <strong className="num">
            {money.format(monthTotal(purchases, month + offset))}
          </strong>
        </button>
      ))}
    </div>
  )
}
