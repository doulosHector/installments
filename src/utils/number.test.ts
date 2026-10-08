import { describe, expect, it } from 'vitest'
import { parseAmount, roundMoney } from './number'

describe('parseAmount', () => {
  it('reads plain and formatted amounts', () => {
    expect(parseAmount('1200')).toBe(1200)
    expect(parseAmount('$1,234.56')).toBe(1234.56)
    expect(parseAmount(' 15 000 ')).toBe(15000)
  })

  it('treats a trailing comma with 1–2 digits as decimal', () => {
    expect(parseAmount('12,5')).toBe(12.5)
    expect(parseAmount('1,234')).toBe(1234)
  })

  it('returns NaN without a number', () => {
    expect(parseAmount('')).toBeNaN()
    expect(parseAmount('abc')).toBeNaN()
  })

  it('rounds to cents', () => {
    expect(roundMoney(10.005)).toBe(10.01)
    expect(roundMoney(3.333)).toBe(3.33)
  })
})
