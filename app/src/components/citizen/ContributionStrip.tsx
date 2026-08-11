import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatSum, formatSumExact } from '@/lib/format'
import { RECENT_CONTRIBUTIONS } from '@/data/citizen'

/**
 * Twelve months of filings at a glance. Bars are proportional to the amount, and
 * each carries its own text — the strip is a summary, not a chart to be decoded.
 */
export function ContributionStrip() {
  const amounts = RECENT_CONTRIBUTIONS.map((c) => c.amount)
  const max = Math.max(...amounts)
  const min = Math.min(...amounts)
  const total = RECENT_CONTRIBUTIONS.reduce((s, c) => s + c.amount, 0)

  /**
   * Scaling from a floor rather than from zero. These twelve values sit within a
   * narrow band, so a zero-based axis would render twelve identical bars and hide
   * the very variation the strip exists to show. The exact figure is printed above
   * each bar and read out by screen readers, so the compressed scale cannot
   * mislead anyone about magnitude.
   */
  const height = (amount: number) => {
    const span = max - min || 1
    return 26 + ((amount - min) / span) * 46
  }

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        title="Recent contributions"
        description="The last twelve months recorded by your employer."
        action={<Badge tone="accent">All 12 months filed</Badge>}
      />

      <CardBody className="pt-4">
        <ol className="flex items-end justify-between gap-1 sm:gap-2">
          {RECENT_CONTRIBUTIONS.map((c, i) => (
            <li key={`${c.month}-${i}`} className="group flex min-w-0 flex-1 flex-col items-center">
              <span className="tabular mb-1.5 hidden text-2xs text-fg-subtle sm:block">
                {formatSum(c.amount, { unit: false })}
              </span>
              <span
                className="w-full rounded-t-sm bg-primary/70 transition-colors duration-150 group-hover:bg-primary"
                style={{ height: `${height(c.amount)}px` }}
                title={`${c.month}: ${formatSumExact(c.amount)}`}
              >
                <span className="sr-only">
                  {c.month}: {formatSumExact(c.amount)}
                </span>
              </span>
              <span className="mt-1.5 text-2xs text-fg-muted">{c.month}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
          <span className="text-sm text-fg-muted">Total contributed in the last 12 months</span>
          <span className="tabular text-lg font-semibold text-fg">{formatSum(total)}</span>
        </div>
      </CardBody>
    </Card>
  )
}
