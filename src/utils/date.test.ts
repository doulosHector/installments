import { describe, expect, it } from 'vitest'
import { formatDate, isDateKey, toDateKey } from './date'

describe('date utils', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('recognizes date keys', () => {
    expect(isDateKey('2026-10-05')).toBe(true)
    expect(isDateKey('2026-1-5')).toBe(false)
    expect(isDateKey('')).toBe(false)
  })

  it('formats a date for display', () => {
    expect(formatDate('2026-10-05')).toBe('Oct 5, 2026')
  })
})
