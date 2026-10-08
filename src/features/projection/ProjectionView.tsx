import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useInstallments } from '../../context/installments'
import { useUi } from '../../context/ui'
import { useMoney } from '../../hooks/useMoney'
import { projectMonths } from '../../services/projection'
import { monthShortYear } from '../../utils/month'
import { ProjectionRow } from './components/ProjectionRow'
import './projection.css'

export function ProjectionView() {
  const { purchases } = useInstallments().state
  const { month, openSheet } = useUi()
  const money = useMoney()
  const projection = useMemo(
    () => projectMonths(purchases, month),
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
      <div className="facts">
        <div className="fact">
          <span>Next 12 months</span>
          <strong className="num">{money.format(projection.sum)}</strong>
        </div>
        <div className="fact">
          <span>Last payment</span>
          <strong>
            {projection.lastPaymentMonth <= month
              ? 'Done'
              : monthShortYear(projection.lastPaymentMonth)}
          </strong>
        </div>
      </div>
      <h2 className="sec">
        <span>Monthly total from {monthShortYear(month + 1)}</span>
        <span className="num">Now {money.format(projection.current)}</span>
      </h2>
      <div className="proj">
        {projection.months.map((data) => (
          <ProjectionRow key={data.month} data={data} max={projection.max} />
        ))}
      </div>
      <p className="muted-note">Tap a month to see which purchases you pay.</p>
    </>
  )
}
