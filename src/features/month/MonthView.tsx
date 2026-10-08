import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useInstallments } from '../../context/installments'
import { useUi } from '../../context/ui'
import { monthSummary } from '../../services/month'
import { monthLong } from '../../utils/month'
import { AheadStrip } from './components/AheadStrip'
import { MonthHero } from './components/MonthHero'
import { PaymentRow } from './components/PaymentRow'
import './month.css'

export function MonthView() {
  const { purchases } = useInstallments().state
  const { month, openSheet } = useUi()
  const summary = useMemo(
    () => monthSummary(purchases, month),
    [purchases, month],
  )

  if (!purchases.length)
    return (
      <EmptyState
        onAdd={() => openSheet({ type: 'purchaseForm', purchaseId: null })}
      />
    )

  return (
    <>
      <MonthHero summary={summary} />
      <AheadStrip />

      <h2 className="sec">
        <span>Payments in {monthLong(month)}</span>
      </h2>
      {summary.payments.length ? (
        <div className="list">
          {summary.payments.map((row) => (
            <PaymentRow key={row.purchase.id} row={row} />
          ))}
        </div>
      ) : (
        <p className="muted-note">Nothing to pay this month.</p>
      )}

      {summary.starting.length > 0 && (
        <>
          <h2 className="sec">
            <span>New this month, first payment in {monthLong(month + 1)}</span>
          </h2>
          <div className="list">
            {summary.starting.map((row) => (
              <PaymentRow key={row.purchase.id} row={row} upcoming />
            ))}
          </div>
        </>
      )}
    </>
  )
}
