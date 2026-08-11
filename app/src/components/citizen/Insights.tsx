import { useMemo } from 'react'
import { AlertTriangle, ArrowUpRight, CalendarDays, Lightbulb, TrendingUp } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { MODEL, projectScenario } from '@/lib/pension'
import { BASE_SCENARIO, CITIZEN } from '@/data/citizen'

type Tone = 'neutral' | 'positive' | 'attention'

interface Insight {
  id: string
  icon: typeof TrendingUp
  tone: Tone
  title: string
  body: string
  action?: string
}

/**
 * Insights are written as observations, not instructions. Each one states what
 * the record shows, then — only where the citizen genuinely has a lever — what
 * could change it. Nothing here promises a return or guarantees an outcome.
 *
 * Every percentage is derived from the same model that drives the rest of the
 * product rather than written by hand, so the copy can never drift away from the
 * figures the citizen sees elsewhere on the page.
 */
function buildInsights(): Insight[] {
  const base = projectScenario(BASE_SCENARIO)

  // Closing the recorded gap: the 14 missing months become qualifying service.
  const gapClosed = projectScenario({
    ...BASE_SCENARIO,
    yearsContributed: BASE_SCENARIO.yearsContributed + CITIZEN.gapMonths / 12,
  })
  const gapGain = pct(gapClosed.monthlyPension, base.monthlyPension)

  const topUpAmount = 400_000
  const withTopUp = projectScenario({
    ...BASE_SCENARIO,
    additionalContribution: topUpAmount,
  })
  const topUpGain = pct(withTopUp.monthlyPension, base.monthlyPension)

  const later = projectScenario({
    ...BASE_SCENARIO,
    retirementAge: BASE_SCENARIO.retirementAge + 3,
  })
  const laterGain = pct(later.monthlyPension, base.monthlyPension)

  const remainingQualifying = Math.max(0, MODEL.fullServiceYears - CITIZEN.yearsContributed)

  return [
    {
      id: 'i1',
      icon: CalendarDays,
      tone: 'neutral',
      title: `You have ${CITIZEN.yearsContributed} years of recorded contribution history.`,
      body: `${remainingQualifying} more qualifying years would reach the ${MODEL.fullServiceYears}-year threshold at which this model applies the full replacement rate.`,
    },
    {
      id: 'i2',
      icon: AlertTriangle,
      tone: 'attention',
      title: 'You have a contribution gap between 2018 and 2019.',
      body: `${CITIZEN.gapMonths} months show no employer filing. If you were employed during that period, correcting the record could raise your qualifying service.`,
      action: 'Report incorrect information',
    },
    {
      id: 'i3',
      icon: TrendingUp,
      tone: 'positive',
      title: `Closing that gap would add about ${gapGain}% to your projected pension.`,
      body: `Recognising those ${CITIZEN.gapMonths} months would raise your qualifying service, which in turn raises the replacement rate applied to your earnings.`,
      action: 'Check employment record',
    },
    {
      id: 'i4',
      icon: ArrowUpRight,
      tone: 'positive',
      title: `A voluntary top-up of 400,000 so’m per month would add about ${topUpGain}% to your projection.`,
      body: 'Voluntary contributions accrue to your individual account and are annuitised separately from the earnings-related component.',
      action: 'Open the simulator',
    },
    {
      id: 'i5',
      icon: Lightbulb,
      tone: 'neutral',
      title: `Retiring three years later would raise your projection by roughly ${laterGain}%.`,
      body: 'Later retirement adds service years and continues accrual, so both components of the pension rise.',
    },
  ]
}

const pct = (next: number, prev: number) => Math.round(((next - prev) / prev) * 100)

export function Insights({ onOpenSimulator }: { onOpenSimulator?: () => void }) {
  const INSIGHTS = useMemo(buildInsights, [])

  return (
    <Card as="section" className="h-full">
      <CardHeader
        as="h2"
        id="insights-heading"
        title="Your pension insights"
        description="What your record shows, and where you still have room to act."
      />

      <CardBody className="pt-4">
        <ul className="space-y-3">
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon
            return (
              <li
                key={insight.id}
                className={cn(
                  'rounded-[var(--radius-control)] border p-4',
                  insight.tone === 'attention'
                    ? 'border-warning/30 bg-warning-soft/40'
                    : 'border-border bg-surface-inset',
                )}
              >
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 shrink-0',
                      insight.tone === 'attention'
                        ? 'text-warning'
                        : insight.tone === 'positive'
                          ? 'text-accent'
                          : 'text-primary',
                    )}
                  >
                    <Icon size={17} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm leading-snug font-medium text-fg">{insight.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{insight.body}</p>

                    {insight.action ? (
                      <button
                        type="button"
                        onClick={onOpenSimulator}
                        className="mt-2.5 inline-flex min-h-11 cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {insight.action}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-fg-subtle">
          Percentages compare illustrative model outputs against your current trajectory. They are
          not forecasts of investment returns and do not represent a guaranteed entitlement.
        </p>
      </CardBody>
    </Card>
  )
}
