import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { Statistics } from '../../../services/statistics'
import { monthLong } from '../../../utils/month'

/** What is left of the purchases still being paid, and how much is paid. */
export function ProgressCard({ current }: { current: Statistics['current'] }) {
  const { month } = useUi()
  const money = useMoney()
  return (
    <section className="group stat-hero">
      <span>Still to pay after {monthLong(month)}</span>
      <strong className="num">{money.format(current.remaining)}</strong>
      <span className="stat-bar" aria-hidden="true">
        <b style={{ width: `${(current.progress * 100).toFixed(1)}%` }} />
      </span>
      <div className="stat-meta num">
        <span>
          Paid <b>{money.format(current.paid)}</b> of{' '}
          {money.format(current.total)}
        </span>
        <b>{Math.round(current.progress * 100)}%</b>
      </div>
      <div className="stat-meta">
        <span>
          {current.count}
          {current.count === 1 ? ' current purchase' : ' current purchases'}
        </span>
      </div>
    </section>
  )
}
