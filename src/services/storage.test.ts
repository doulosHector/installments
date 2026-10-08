import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installmentsState, purchase } from '../test/factories'
import { STORAGE_KEY, loadState, saveState } from './storage'

const memoryStorage = () => {
  const items = new Map<string, string>()
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  }
}

describe('storage', () => {
  beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
  afterEach(() => vi.unstubAllGlobals())

  it('starts with defaults when nothing is saved or data is corrupt', () => {
    expect(loadState().purchases).toEqual([])
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState().settings.currency).toBe('MXN')
  })

  it('saves in the original format and loads it back', () => {
    const state = installmentsState({ purchases: [purchase({ id: 'p1' })] })
    expect(saveState(state)).toBe(true)
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(raw.version).toBe(1)
    expect(typeof raw.updatedAt).toBe('number')
    expect(loadState()).toEqual(state)
  })

  it('reports when storage fails', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('QuotaExceeded')
      },
    })
    expect(saveState(installmentsState())).toBe(false)
  })
})
