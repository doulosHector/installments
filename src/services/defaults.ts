import { DEFAULT_CURRENCY } from '../constants/currencies'
import type { InstallmentsState } from '../types'

export const createDefaultState = (): InstallmentsState => ({
  settings: { theme: 'system', currency: DEFAULT_CURRENCY },
  purchases: [],
})
