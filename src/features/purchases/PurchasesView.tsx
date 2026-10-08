import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useInstallments } from '../../context/installments'
import { useUi } from '../../context/ui'
import { useMoney } from '../../hooks/useMoney'
import { filterPurchases, remainingAfter } from '../../services/purchases'
import { monthLong } from '../../utils/month'
import { PurchaseFilters } from './components/PurchaseFilters'
import { PurchaseItem } from './components/PurchaseItem'
import './purchases.css'

export function PurchasesView() {
  const { purchases } = useInstallments().state
  const { month, filters, openSheet } = useUi()
  const money = useMoney()
  const rows = useMemo(
    () => filterPurchases(purchases, month, filters),
    [purchases, month, filters],
  )
  const { remaining, count } = useMemo(
    () => remainingAfter(purchases, month),
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
      <div className="summary">
        <div>
          <span>Still to pay after {monthLong(month)}</span>
          <strong className="num">{money.format(remaining)}</strong>
        </div>
        <span>{count} current</span>
      </div>
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
