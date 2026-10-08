import { Segments } from '../../../components/ui'
import { useUi } from '../../../context/ui'
import { useMoney } from '../../../hooks/useMoney'
import type { ScheduledPurchase } from '../../../services/schedule'

/**
 * A purchase in the month list. `upcoming` rows are purchases made this
 * month: they show the regular payment, which starts next month.
 */
export function PaymentRow({
  row: { purchase, schedule },
  upcoming = false,
}: {
  row: ScheduledPurchase
  upcoming?: boolean
}) {
  const { openSheet } = useUi()
  const money = useMoney()

  return (
    <button
      type="button"
      className="row"
      onClick={() =>
        openSheet({ type: 'purchaseForm', purchaseId: purchase.id })
      }
    >
      <span className="row-title">{purchase.description}</span>
      <span className="row-amt num">
        {money.format(upcoming ? schedule.base : schedule.due)}
      </span>
      <span className="row-sub">
        {upcoming ? (
          <>
            Payment 0 of {schedule.count}
            <span className="badge new">Not counted yet</span>
          </>
        ) : (
          <>
            Payment {schedule.paidCount} of {schedule.count}
            {schedule.status === 'last' && (
              <span className="badge">Last payment</span>
            )}
          </>
        )}
      </span>
      <Segments schedule={schedule} />
    </button>
  )
}
