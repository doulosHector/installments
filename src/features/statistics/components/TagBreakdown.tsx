import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { TagShare } from '../../../services/statistics'
import { monthLong } from '../../../utils/month'
import { cx } from '../../../utils/style'

interface TagBreakdownProps {
  shares: TagShare[]
  /** Payments due this month, to tell when a purchase counts twice. */
  paymentCount: number
}

/** This month's payments grouped by tag, with bars against the biggest. */
export function TagBreakdown({ shares, paymentCount }: TagBreakdownProps) {
  const { month } = useUi()
  const money = useMoney()
  const max = Math.max(1, ...shares.map((s) => s.due))
  const countedTwice = shares.reduce((n, s) => n + s.count, 0) > paymentCount

  return (
    <>
      <h2 className="sec">
        <span>{monthLong(month)} by tag</span>
      </h2>
      {shares.length ? (
        <div className="list">
          {shares.map((s) => (
            <div key={s.tag ?? ''} className="tagrow">
              <span className={cx('tname', !s.tag && 'none')}>
                {s.tag ?? 'No tag'}
                <small>
                  {s.count}
                  {s.count === 1 ? ' payment' : ' payments'}
                </small>
              </span>
              <span className="tbar" aria-hidden="true">
                <b style={{ width: `${((s.due / max) * 100).toFixed(1)}%` }} />
              </span>
              <span className="pval num">{money.format(s.due)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-note">Nothing to pay this month.</p>
      )}
      {countedTwice && (
        <p className="stats-hint">
          A purchase with several tags counts in each of them.
        </p>
      )}
    </>
  )
}
