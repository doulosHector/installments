/**
 * Reads an amount typed by the user. Accepts currency symbols and thousands
 * separators; a comma followed by 1–2 digits (and no dot) is a decimal comma.
 * Returns `NaN` when there is no number.
 */
export const parseAmount = (input: string): number => {
  let s = input.trim().replace(/[^\d.,-]/g, '')
  if (/,\d{1,2}$/.test(s) && !s.includes('.')) s = s.replace(',', '.')
  else s = s.replace(/,/g, '')
  const value = parseFloat(s)
  return Number.isFinite(value) ? value : NaN
}

/** Rounds to cents. */
export const roundMoney = (value: number): number =>
  Math.round(value * 100) / 100
