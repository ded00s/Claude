import { useMemo, useState } from 'react'
import { Hero } from '@/components/citizen/Hero'
import { ForecastChart } from '@/components/citizen/ForecastChart'
import { Timeline } from '@/components/citizen/Timeline'
import { Readiness } from '@/components/citizen/Readiness'
import { Insights } from '@/components/citizen/Insights'
import { Actions } from '@/components/citizen/Actions'
import { ContributionStrip } from '@/components/citizen/ContributionStrip'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { buildForecast, computeReadiness, projectScenario } from '@/lib/pension'
import { BASE_SCENARIO, CITIZEN, CURRENT_YEAR } from '@/data/citizen'

/**
 * Citizen dashboard.
 *
 * Reading order is deliberate and matches importance: the headline projection,
 * then how it moves with retirement age, then the record it rests on, then what
 * the citizen can do. Each block is a landmark region so screen-reader users can
 * jump between them in the same order.
 */
export function CitizenView({ onOpenSimulator }: { onOpenSimulator: () => void }) {
  const [compare, setCompare] = useState<'current' | 'both'>('both')

  const result = useMemo(() => projectScenario(BASE_SCENARIO), [])

  const optimisedScenario = useMemo(
    () => ({ ...BASE_SCENARIO, salaryGrowth: 0.08, additionalContribution: 400_000 }),
    [],
  )

  const forecast = useMemo(
    () =>
      buildForecast(
        BASE_SCENARIO,
        optimisedScenario,
        CITIZEN.currentAge + 1,
        70,
        CURRENT_YEAR,
      ),
    [optimisedScenario],
  )

  const readiness = useMemo(
    () =>
      computeReadiness({
        yearsContributed: CITIZEN.yearsContributed,
        yearsToRetirement: result.yearsToRetirement,
        gapMonths: CITIZEN.gapMonths,
        totalRecordedMonths: CITIZEN.totalRecordedMonths,
        adequacy: result.adequacy,
      }),
    [result],
  )

  return (
    <div className="space-y-6">
      <Hero result={result} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          Compare your current path against a path with higher salary growth and a voluntary
          top-up.
        </p>
        <SegmentedControl
          label="Forecast comparison"
          value={compare}
          onChange={setCompare}
          options={[
            { value: 'current', label: 'Current only' },
            { value: 'both', label: 'Compare paths' },
          ]}
        />
      </div>

      <ForecastChart
        data={forecast}
        showOptimised={compare === 'both'}
        selectedAge={CITIZEN.statutoryRetirementAge}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Readiness readiness={readiness} />
        <Insights onOpenSimulator={onOpenSimulator} />
      </div>

      <Timeline />

      <ContributionStrip />

      <Actions onCalculate={onOpenSimulator} />
    </div>
  )
}
