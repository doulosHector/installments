import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { MonthIndex, PurchaseFilters, SheetState, View } from '../../types'
import { currentMonthIndex } from '../../utils/month'
import { UiContext, type ActiveSheet } from './UiContext'

const INITIAL_FILTERS: PurchaseFilters = {
  status: 'active',
  tag: null,
  query: '',
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>('purchases')
  const [today] = useState(currentMonthIndex)
  const [month, setMonthState] = useState(today)
  const [openMonth, setOpenMonth] = useState<MonthIndex | null>(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [sheet, setSheet] = useState<ActiveSheet | null>(null)
  const [isSheetOpen, setSheetOpen] = useState(false)

  const setView = useCallback((next: View) => {
    setViewState(next)
    window.scrollTo(0, 0)
  }, [])

  const setMonth = useCallback((next: MonthIndex) => {
    setMonthState(next)
    setOpenMonth(null)
  }, [])

  const toggleOpenMonth = useCallback((next: MonthIndex) => {
    setOpenMonth((current) => (current === next ? null : next))
  }, [])

  const updateFilters = useCallback((changes: Partial<PurchaseFilters>) => {
    setFilters((current) => ({ ...current, ...changes }))
  }, [])

  const openSheet = useCallback((state: SheetState) => {
    setSheet((current) => ({ state, key: (current?.key ?? 0) + 1 }))
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const value = useMemo(
    () => ({
      view,
      setView,
      today,
      month,
      setMonth,
      openMonth,
      toggleOpenMonth,
      filters,
      updateFilters,
      sheet,
      isSheetOpen,
      openSheet,
      closeSheet,
    }),
    [
      view,
      setView,
      today,
      month,
      setMonth,
      openMonth,
      toggleOpenMonth,
      filters,
      updateFilters,
      sheet,
      isSheetOpen,
      openSheet,
      closeSheet,
    ],
  )

  return <UiContext value={value}>{children}</UiContext>
}
