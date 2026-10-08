import { describe, expect, it } from 'vitest'
import { moneyFormat } from './format'

describe('moneyFormat', () => {
  const money = moneyFormat('MXN')

  it('formats cents with the narrow symbol', () => {
    expect(money.format(123450)).toBe('$1,234.50')
    expect(moneyFormat('EUR').format(1000)).toBe('€10.00')
  })

  it('adds a sign, using a real minus', () => {
    expect(money.signed(500)).toBe('+$5.00')
    expect(money.signed(-500)).toBe('−$5.00')
  })

  it('splits the whole part from the cents', () => {
    expect(money.parts(123450)).toEqual({ main: '$1,234', fraction: '.50' })
  })
})
