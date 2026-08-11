import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChartTooltip } from '@/components/ui/ChartTooltip'
import { useVizTokens } from '@/lib/vizTokens'
import { useCountUp } from '@/hooks/useCountUp'
import { formatSum, formatSumExact, pluralYears } from '@/lib/format'
import { MODEL, projectScenario, type ScenarioInput } from '@/lib/pension'
import { BASE_SCENARIO, CITIZEN } from '@/data/citizen'

/**
 * The simulator is the emotional centre of the product: it turns an abstract
 * entitlement into something the citizen can move. Every control maps to one
 * lever a person actually has, and the two outcomes are always shown side by
 * side — a single number in isolation invites neither understanding nor action.
 */
export function Simulator({ onScenarioChange }: { onScenarioChange?: (s: ScenarioInput) => void }) {
  const [scenario, setScenario] = useState<ScenarioInput>({
    ...BASE_SCENARIO,
    salaryGrowth: 0.08,
    additionalContribution: 400_000,
    retirementAge: 63,
  })

  const viz = useVizTokens()

  const baseline = useMemo(() => projectScenario(BASE_SCENARIO), [])
  const optimised = useMemo(() => projectScenario(scenario), [scenario])

  const animated = useCountUp(optimised.monthlyPension)
  const difference = optimised.monthlyPension - baseline.monthlyPension
  const pctChange = (difference / baseline.monthlyPension) * 100

  const update = (patch: Partial<ScenarioInput>) => {
    const next = { ...scenario, ...patch }
    setScenario(next)
    onScenarioChange?.(next)
  }

  const reset = () => {
    setScenario(BASE_SCENARIO)
    onScenarioChange?.(BASE_SCENARIO)
  }

  const comparison = [
    { name: 'Current', value: baseline.monthlyPension, tone: viz['viz-current'] },
    { name: 'Simulated', value: optimised.monthlyPension, tone: viz['viz-optimised'] },
  ]

  return (
    <Card as="section" variant="raised">
      <CardHeader
        as="h2"
        id="simulator-heading"
        title="What if?"
        description="Move any control to see how that choice changes your projected pension. Nothing here is saved, and nothing affects your real record."
        action={
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </Button>
        }
      />

      <CardBody className="pt-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10">
          {/* ---------------- Controls ---------------- */}
          <div className="space-y-6">
            <Slider
              label="Current monthly salary"
              value={scenario.monthlySalary}
              min={1_000_000}
              max={40_000_000}
              step={200_000}
              onChange={(v) => update({ monthlySalary: v })}
              display={formatSum(scenario.monthlySalary)}
              hint="Gross salary before tax"
            />

            <Slider
              label="Years already contributed"
              value={scenario.yearsContributed}
              min={0}
              max={40}
              step={1}
              onChange={(v) => update({ yearsContributed: v })}
              display={pluralYears(scenario.yearsContributed)}
              hint={`${MODEL.fullServiceYears} years qualifies for the full replacement rate in this model`}
            />

            <Slider
              label="Expected annual salary growth"
              value={Math.round(scenario.salaryGrowth * 100)}
              min={0}
              max={20}
              step={1}
              onChange={(v) => update({ salaryGrowth: v / 100 })}
              display={`${Math.round(scenario.salaryGrowth * 100)}% per year`}
              hint="Average nominal growth until you retire"
            />

            <Slider
              label="Additional monthly contribution"
              value={scenario.additionalContribution}
              min={0}
              max={3_000_000}
              step={50_000}
              onChange={(v) => update({ additionalContribution: v })}
              display={
                scenario.additionalContribution === 0
                  ? 'None'
                  : formatSum(scenario.additionalContribution)
              }
              hint="Voluntary top-up to your individual account"
            />

            <Slider
              label="Retirement age"
              value={scenario.retirementAge}
              min={CITIZEN.currentAge + 1}
              max={70}
              step={1}
              onChange={(v) => update({ retirementAge: v })}
              display={`${scenario.retirementAge} years old`}
              hint={`Statutory age is ${MODEL.statutoryAge.women} for women and ${MODEL.statutoryAge.men} for men`}
            />
          </div>

          {/* ---------------- Outcome ---------------- */}
          <div className="space-y-5">
            <div className="rounded-[var(--radius-card)] border border-border bg-surface-inset p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
                  Your projected pension
                </p>
                <Badge tone={difference >= 0 ? 'accent' : 'warning'} icon={<Sparkles size={12} />}>
                  {difference >= 0 ? 'Improved' : 'Reduced'} by {Math.abs(pctChange).toFixed(1)}%
                </Badge>
              </div>

              <p
                className="tabular mt-3 text-4xl font-semibold text-fg sm:text-5xl"
                aria-label={formatSumExact(optimised.monthlyPension)}
              >
                {formatSum(animated, { unit: false })}
                <span className="ml-2 text-base font-normal text-fg-muted">сўм / month</span>
              </p>

              {/* Explicit before → after, so the change is never inferred from motion alone. */}
              {/* The unit is stated once at the end rather than after every figure —
                  repeating it three times turns a simple comparison into noise. */}
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="tabular text-fg-muted line-through decoration-fg-subtle/50">
                  {formatSum(baseline.monthlyPension, { unit: false })}
                </span>
                <ArrowRight size={15} className="text-fg-subtle" aria-hidden="true" />
                <span className="tabular font-semibold text-accent">
                  {formatSum(optimised.monthlyPension, { unit: false })}
                </span>
                <span className="text-fg-subtle">
                  ({difference >= 0 ? '+' : '−'}
                  {formatSum(Math.abs(difference), { unit: false })} сўм per month)
                </span>
              </div>
            </div>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparison}
                  layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
                  barCategoryGap={20}
                >
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tick={{ fill: 'var(--fg-muted)', fontSize: 13 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--surface-inset)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload as (typeof comparison)[number]
                      return (
                        <ChartTooltip
                          title={`${d.name} scenario`}
                          rows={[
                            {
                              label: 'Monthly pension',
                              value: formatSumExact(d.value),
                              color: d.tone,
                            },
                          ]}
                        />
                      )
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={350}>
                    {comparison.map((d) => (
                      <Cell key={d.name} fill={d.tone} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 sm:grid-cols-3">
              <Metric
                label="Replacement rate"
                value={`${Math.round(optimised.replacementRate * 100)}%`}
                note="of indexed earnings"
              />
              <Metric
                label="Total service"
                value={pluralYears(Math.round(optimised.totalServiceYears))}
                note="at retirement"
              />
              <Metric
                label="Capital at retirement"
                value={formatSum(optimised.capitalAtRetirement, { unit: false })}
                note="сўм"
              />
              <Metric
                label="From earnings"
                value={formatSum(optimised.fromEarnings, { unit: false })}
                note="сўм / month"
              />
              <Metric
                label="From capital"
                value={formatSum(optimised.fromCapital, { unit: false })}
                note="сўм / month"
              />
              <Metric
                label="Expected final salary"
                value={formatSum(optimised.finalSalary, { unit: false })}
                note="сўм / month"
              />
            </dl>

            <p className="text-xs leading-relaxed text-fg-subtle">
              This simulator uses a simplified illustrative model, not the statutory pension
              formula. It is provided to help you understand which factors matter, and cannot be
              used to establish or dispute an entitlement.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-fg-muted">{label}</dt>
      <dd className="tabular mt-1 text-lg font-semibold text-fg">
        {value} <span className="text-xs font-normal text-fg-subtle">{note}</span>
      </dd>
    </div>
  )
}
