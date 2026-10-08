import { useMemo } from 'react'
import { useInstallments } from '../context/installments'
import { moneyFormat, type MoneyFormat } from '../utils/format'

/** Money formatter for the currency chosen in Settings. */
export function useMoney(): MoneyFormat {
  const { currency } = useInstallments().state.settings
  return useMemo(() => moneyFormat(currency), [currency])
}
