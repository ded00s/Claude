/**
 * Formatting helpers.
 *
 * Sums are in Uzbek so'm (UZS). Amounts are large, so the interface almost never
 * prints a raw figure — it abbreviates to million / billion / trillion so a
 * citizen can compare magnitudes at a glance, and keeps the exact number for
 * tooltips and screen readers.
 */

const UZS = 'сўм' // "so'm" in Uzbek Cyrillic

/** 8_400_000 -> "8.4 mln so'm" */
export function formatSum(value: number, opts: { unit?: boolean } = {}): string {
  const unit = opts.unit !== false
  const abs = Math.abs(value)
  const suffix = unit ? ` ${UZS}` : ''

  if (abs >= 1e12) return `${trim(value / 1e12)} trln${suffix}`
  if (abs >= 1e9) return `${trim(value / 1e9)} mlrd${suffix}`
  if (abs >= 1e6) return `${trim(value / 1e6)} mln${suffix}`
  if (abs >= 1e3) return `${trim(value / 1e3)} ming${suffix}`
  return `${Math.round(value)}${suffix}`
}

/** Exact grouped figure, for tooltips and assistive text. */
export function formatSumExact(value: number): string {
  return `${new Intl.NumberFormat('en-US').format(Math.round(value))} ${UZS}`
}

/** Compact count: 5_240_000 -> "5.24M" */
export function formatCount(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1e6) return `${trim(value / 1e6)}M`
  if (abs >= 1e3) return `${trim(value / 1e3)}K`
  return String(Math.round(value))
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`
}

/** Always carries an explicit sign — deltas must never be ambiguous. */
export function formatDelta(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(digits)}%`
}

function trim(n: number): string {
  const rounded = Math.abs(n) >= 100 ? n.toFixed(0) : Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2)
  return rounded.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')
}

export function pluralYears(n: number): string {
  return `${n} ${n === 1 ? 'year' : 'years'}`
}
