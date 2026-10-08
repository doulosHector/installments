/** Quotes a CSV cell when it contains a quote, comma or line break. */
export const csvCell = (value: string | number): string => {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const toCsv = (rows: (string | number)[][]): string =>
  rows.map((row) => row.map(csvCell).join(',')).join('\n')
