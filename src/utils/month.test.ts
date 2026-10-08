import { describe, expect, it } from 'vitest'
import { monthIndex } from '../test/factories'
import {
  monthLong,
  monthOfDate,
  monthShortYear,
  monthYear,
  toMonthIndex,
  yearOf,
} from './month'

describe('month utils', () => {
  it('counts months from year 0', () => {
    expect(toMonthIndex(new Date(2026, 9, 8))).toBe(2026 * 12 + 9)
    expect(monthOfDate('2026-10-31')).toBe(monthIndex(2026, 10))
    expect(yearOf(monthIndex(2026, 12))).toBe(2026)
  })

  it('names months, rolling over the year', () => {
    const dec = monthIndex(2026, 12)
    expect(monthLong(dec)).toBe('December')
    expect(monthYear(dec + 1)).toBe('January 2027')
    expect(monthShortYear(dec - 1)).toBe('Nov 2026')
  })
})
