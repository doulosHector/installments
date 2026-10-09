import { useMoney } from '../../../hooks/useMoney'
import type { Statistics } from '../../../services/statistics'
import { monthShortYear } from '../../../utils/month'

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

/** Four headline figures in a two-column grid. */
export function StatFacts({ stats }: { stats: Statistics }) {
  const money = useMoney()
  return (
    <div className="facts">
      <div className="fact">
        <span>Monthly average</span>
        <strong className="num">{money.format(stats.averageAhead)}</strong>
        <small>Next 12 months</small>
      </div>
      <div className="fact">
        <span>Highest month</span>
        <strong className="num">
          {stats.peak ? money.format(stats.peak.total) : money.format(0)}
        </strong>
        <small>
          {stats.peak ? monthShortYear(stats.peak.month) : 'No payments ahead'}
        </small>
      </div>
      <div className="fact">
        <span>Total bought</span>
        <strong className="num">{money.format(stats.bought.total)}</strong>
        <small>{plural(stats.bought.count, 'purchase', 'purchases')}</small>
      </div>
      <div className="fact">
        <span>Paid off</span>
        <strong className="num">{stats.finishedCount}</strong>
        <small>
          {stats.finishedCount === 1
            ? 'purchase finished'
            : 'purchases finished'}
        </small>
      </div>
    </div>
  )
}
