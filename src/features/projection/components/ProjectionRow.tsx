import { useMemo } from 'react'
import { useInstallments } from '../../../context/installments'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { ProjectedMonth } from '../../../services/projection'
import { paymentsInMonth } from '../../../services/schedule'
import { monthShort, yearOf } from '../../../utils/month'

function MonthDetail({ month }: { month: number }) {
  const { purchases } = useInstallments().state
  const money = useMoney()
  const payments = useMemo(
    () => paymentsInMonth(purchases, month),
    [purchases, month],
  )
  return (
    <div className="pdetail">
      {payments.length ? (
        payments.map(({ purchase, schedule }) => (
          <div key={purchase.id}>
            <span>
              {purchase.description}{' '}
              <span className="num">
                ({schedule.paidCount}/{schedule.count})
              </span>
            </span>
            <b className="num">{money.format(schedule.due)}</b>
          </div>
        ))
      ) : (
        <div>
          <span>No payments</span>
        </div>
      )}
    </div>
  )
}

/** One projected month: a bar against the biggest month, and its change. */
export function ProjectionRow({
  data: { month, total, delta },
  max,
}: {
  data: ProjectedMonth
  max: number
}) {
  const { openMonth, toggleOpenMonth } = useUi()
  const money = useMoney()
  const open = openMonth === month

  return (
    <>
      <button
        type="button"
        className="prow"
        aria-expanded={open}
        onClick={() => toggleOpenMonth(month)}
      >
        <span className="pm">
          {monthShort(month)}
          <small>{yearOf(month)}</small>
        </span>
        <span className="pbar">
          <b style={{ width: `${((total / max) * 100).toFixed(1)}%` }} />
        </span>
        <span className="pval num">
          {money.format(total)}
          {delta ? (
            <small className={`delta ${delta > 0 ? 'up' : 'down'}`}>
              {money.signed(delta)}
            </small>
          ) : (
            <small className="same">No change</small>
          )}
        </span>
      </button>
      {open && <MonthDetail month={month} />}
    </>
  )
}
