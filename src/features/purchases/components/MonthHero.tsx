import { Money } from '../../../components/ui'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { MonthSummary } from '../../../services/month'
import { monthLong } from '../../../utils/month'

/** Total to pay in the browsed month and how it compares to the last one. */
export function MonthHero({ summary }: { summary: MonthSummary }) {
  const { month, today } = useUi()
  const money = useMoney()
  const { payments, total, delta, endingCount } = summary
  const previous = monthLong(month - 1)

  return (
    <section className="hero">
      <p className="hero-label">
        {month === today
          ? 'To pay this month'
          : `To pay in ${monthLong(month)}`}
      </p>
      <p className="hero-amount num">
        <Money cents={total} />
      </p>
      <div className="hero-meta">
        <span>
          {payments.length}
          {payments.length === 1 ? ' payment' : ' payments'}
        </span>
        {delta === 0 ? (
          <span>Same as {previous}</span>
        ) : (
          <span className={`delta ${delta > 0 ? 'up' : 'down'} num`}>
            {money.signed(delta)} vs {previous}
          </span>
        )}
        {endingCount > 0 && <span>{endingCount} ending this month</span>}
      </div>
    </section>
  )
}
