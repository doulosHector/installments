import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useInstallments } from '../../context/installments'
import { useUi } from '../../context/ui'
import { monthSummary } from '../../services/month'
import { filterPurchases } from '../../services/purchases'
import { AheadStrip } from './components/AheadStrip'
import { MonthHero } from './components/MonthHero'
import { PurchaseFilters } from './components/PurchaseFilters'
import { PurchaseItem } from './components/PurchaseItem'
import './purchases.css'

export function PurchasesView() {
  const { purchases } = useInstallments().state
  const { month, filters, openSheet } = useUi()
  const summary = useMemo(
    () => monthSummary(purchases, month),
    [purchases, month],
  )
  const rows = useMemo(
    () => filterPurchases(purchases, month, filters),
    [purchases, month, filters],
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
      <PurchaseFilters />
      <div className="plist">
        {rows.length ? (
          <div className="list">
            {rows.map((row) => (
              <PurchaseItem key={row.purchase.id} row={row} />
            ))}
          </div>
        ) : (
          <p className="muted-note">No purchases match.</p>
        )}
      </div>
    </>
  )
}
