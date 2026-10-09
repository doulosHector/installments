import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useInstallments } from '../../context/installments'
import { useUi } from '../../context/ui'
import { computeStatistics } from '../../services/statistics'
import { EndingSoon } from './components/EndingSoon'
import { ProgressCard } from './components/ProgressCard'
import { StatFacts } from './components/StatFacts'
import { TagBreakdown } from './components/TagBreakdown'
import './statistics.css'

export function StatisticsView() {
  const { purchases } = useInstallments().state
  const { month, openSheet } = useUi()
  const stats = useMemo(
    () => computeStatistics(purchases, month),
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
      <ProgressCard current={stats.current} />
      <StatFacts stats={stats} />
      <EndingSoon stats={stats} />
      <TagBreakdown shares={stats.byTag} paymentCount={stats.paymentCount} />
    </>
  )
}
