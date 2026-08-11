import { CalendarClock, Coins, PiggyBank, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Stat } from '@/components/ui/Stat'
import { Badge } from '@/components/ui/Badge'
import { formatSum, formatSumExact, pluralYears } from '@/lib/format'
import { CITIZEN } from '@/data/citizen'
import type { ScenarioResult } from '@/lib/pension'
import { useCountUp } from '@/hooks/useCountUp'

/**
 * The five-second layer. A citizen arriving here should be able to answer
 * "how much, from what, and when" before reading a single body paragraph — so the
 * projected figure is the largest element on the page by a wide margin, and the
 * four supporting numbers sit directly beneath it in a single scan line.
 */
export function Hero({ result }: { result: ScenarioResult }) {
  const animated = useCountUp(result.monthlyPension)

  return (
    <section aria-labelledby="hero-heading" className="animate-rise">
      <Card variant="raised" className="relative overflow-hidden">
        {/* Geometric motif, held at very low contrast so it reads as paper texture
            rather than ornament. Hidden from assistive tech. */}
        <StarField />

        <div className="relative grid gap-8 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:p-8">
          <div className="min-w-0">
            <Badge tone="primary">Projected at age {CITIZEN.statutoryRetirementAge}</Badge>

            <h1 id="hero-heading" className="mt-4 text-2xl font-semibold text-fg sm:text-3xl">
              Your pension future, clearly explained.
            </h1>
            <p className="mt-2 max-w-lg text-sm text-fg-muted">
              Based on {pluralYears(CITIZEN.yearsContributed)} of recorded contributions and your
              current salary. Figures are illustrative.
            </p>

            <div className="mt-7">
              <Stat
                size="hero"
                label="Estimated monthly pension"
                value={formatSum(animated, { unit: false })}
                valueLabel={formatSumExact(result.monthlyPension)}
                unit="сўм / month"
                hint={
                  <span>
                    Replaces{' '}
                    <span className="font-medium text-fg">
                      {Math.round(result.adequacy * 100)}%
                    </span>{' '}
                    of your expected final salary
                  </span>
                }
              />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <Stat
              inDefinitionList
              icon={<PiggyBank size={14} />}
              label="Pension capital"
              value={formatSum(CITIZEN.accumulatedCapital, { unit: false })}
              valueLabel={formatSumExact(CITIZEN.accumulatedCapital)}
              unit="сўм"
              hint="Contributions to date"
            />
            <Stat
              inDefinitionList
              icon={<Coins size={14} />}
              label="Years of contribution"
              value={String(CITIZEN.yearsContributed)}
              unit="years"
              hint={`Last filed ${CITIZEN.lastContribution}`}
            />
            <Stat
              inDefinitionList
              icon={<CalendarClock size={14} />}
              label="Retirement age"
              value={String(CITIZEN.statutoryRetirementAge)}
              hint={`In ${pluralYears(result.yearsToRetirement)}`}
            />
            <Stat
              inDefinitionList
              icon={<TrendingUp size={14} />}
              label="Capital at retirement"
              value={formatSum(result.capitalAtRetirement, { unit: false })}
              valueLabel={formatSumExact(result.capitalAtRetirement)}
              unit="сўм"
              hint="Projected"
            />
          </dl>
        </div>
      </Card>
    </section>
  )
}

/**
 * A fine geometric field in the top-right corner. Tiles are small and the opacity
 * is very low, so it reads as watermarked paper rather than as ornament — and it
 * is suppressed entirely on small screens, where it would crowd the headline.
 */
function StarField() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -top-8 -right-8 hidden h-56 w-56 text-primary opacity-[0.05] sm:block dark:opacity-[0.09]"
      viewBox="0 0 200 200"
      fill="none"
    >
      <defs>
        <pattern id="mfp-star" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M10 2.4l1.85 2.7 3.15.9-1.98 2.6.12 3.25L10 10.8l-3.14 1.05.12-3.25-1.98-2.6 3.15-.9z"
            fill="currentColor"
          />
        </pattern>
        <radialGradient id="mfp-star-fade" cx="80%" cy="20%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="mfp-star-mask">
          <rect width="200" height="200" fill="url(#mfp-star-fade)" />
        </mask>
      </defs>
      <rect width="200" height="200" fill="url(#mfp-star)" mask="url(#mfp-star-mask)" />
    </svg>
  )
}
