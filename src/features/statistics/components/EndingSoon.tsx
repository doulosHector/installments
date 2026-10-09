import { Segments } from '../../../components/ui'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import { getSchedule } from '../../../services/schedule'
import type { Statistics } from '../../../services/statistics'
import { monthShortYear } from '../../../utils/month'

/** Purchases that make their last payment soon, and what that frees up. */
export function EndingSoon({ stats }: { stats: Statistics }) {
  const { month, openSheet } = useUi()
  const money = useMoney()

  return (
    <>
      <h2 className="sec">
        <span>Ending by {monthShortYear(stats.endingBy)}</span>
        {stats.freed > 0 && (
          <span className="num">Frees {money.format(stats.freed)}/mo</span>
        )}
      </h2>
      {stats.ending.length ? (
        <div className="list">
          {stats.ending.map(({ purchase, lastMonth, monthly }) => (
            <button
              key={purchase.id}
              type="button"
              className="row"
              onClick={() =>
                openSheet({ type: 'purchaseForm', purchaseId: purchase.id })
              }
            >
              <span className="row-title">{purchase.description}</span>
              <span className="row-amt num">{money.format(monthly)}</span>
              <span className="row-sub">
                Last payment in {monthShortYear(lastMonth)}
              </span>
              <Segments schedule={getSchedule(purchase, month)} />
            </button>
          ))}
        </div>
      ) : (
        <p className="muted-note">No purchases end in the next 3 months.</p>
      )}
    </>
  )
}
