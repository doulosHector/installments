import type { InstallmentsState } from '../types'
import { createDefaultState } from './defaults'
import { normalizeState } from './normalize'

/** Same key as the original single-file app, so existing data keeps working. */
export const STORAGE_KEY = 'installments-tracker.v1'

export const loadState = (): InstallmentsState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return normalizeState(JSON.parse(raw))
  } catch {
    // Corrupted data or storage not available: start fresh.
  }
  return createDefaultState()
}

/**
 * Persists the state in the original app's format (`version`, `updatedAt`).
 * Returns `false` if storage is full or unavailable.
 */
export const saveState = (state: InstallmentsState): boolean => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, updatedAt: Date.now(), ...state }),
    )
    return true
  } catch {
    return false
  }
}
