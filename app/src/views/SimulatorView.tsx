import { useMemo, useState } from 'react'
import { Simulator } from '@/components/citizen/Simulator'
import { ForecastChart } from '@/components/citizen/ForecastChart'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { buildForecast, MODEL, type ScenarioInput } from '@/lib/pension'
import { BASE_SCENARIO, CITIZEN, CURRENT_YEAR } from '@/data/citizen'

/**
 * The simulator gets its own view so it can be linked to directly and used at
 * full width — it is the tool citizens will return to, not a widget on a page.
 * The forecast beneath it re-renders live against whatever the sliders say.
 */
export function SimulatorView() {
  const [scenario, setScenario] = useState<ScenarioInput>({
    ...BASE_SCENARIO,
    salaryGrowth: 0.08,
    additionalContribution: 400_000,
    retirementAge: 63,
  })

  const forecast = useMemo(
    () => buildForecast(BASE_SCENARIO, scenario, CITIZEN.currentAge + 1, 70, CURRENT_YEAR),
    [scenario],
  )

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-fg sm:text-3xl">
          Model your pension, one decision at a time.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Adjust any factor below to see how it changes your projection. Your real record is never
          modified, and nothing you enter here is stored or submitted.
        </p>
      </header>

      <Simulator onScenarioChange={setScenario} />

      <ForecastChart data={forecast} showOptimised selectedAge={scenario.retirementAge} />

      <HowItWorks />
    </div>
  )
}

/**
 * Transparency section. A citizen who is shown a number about their own money is
 * owed the arithmetic behind it — especially when that number is a model output
 * rather than an entitlement.
 */
function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: 'Earnings-related component',
      body: `Your indexed career-average salary is multiplied by a replacement rate. That rate is ${Math.round(
        MODEL.baseReplacement * 100,
      )}% at ${MODEL.fullServiceYears} years of service, rising ${Math.round(
        MODEL.perExtraYear * 100,
      )} percentage point per additional year, to a ceiling of ${Math.round(
        MODEL.maxReplacement * 100,
      )}%.`,
    },
    {
      n: 2,
      title: 'Individual capital component',
      body: `${Math.round(
        MODEL.accrualRate * 100,
      )}% of each year's salary, plus any voluntary top-up, accrues to your individual account and is indexed at ${Math.round(
        MODEL.indexation * 100,
      )}% a year until retirement.`,
    },
    {
      n: 3,
      title: 'Converting capital to a monthly amount',
      body: `The accumulated capital is spread evenly across an assumed payout period of ${MODEL.payoutYears} years, giving a monthly figure that is added to the earnings-related component.`,
    },
    {
      n: 4,
      title: 'Why the range widens',
      body: 'Salary growth, indexation and career length all compound. The further away retirement is, the more a small difference in any of them changes the result — so the projection is shown as a range rather than a single line.',
    },
  ]

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        title="How this projection is calculated"
        description="The full arithmetic behind every figure on this page."
      />
      <CardBody className="pt-4">
        <ol className="grid gap-5 sm:grid-cols-2">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-3.5">
              <span
                aria-hidden="true"
                className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary-soft-fg"
              >
                {step.n}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-[var(--radius-control)] border border-warning/30 bg-warning-soft/40 p-4 text-xs leading-relaxed text-warning-soft-fg">
          <span className="font-semibold">This is a simplified teaching model.</span> It was written
          for a design concept and is deliberately more legible than the statutory formula used by
          the Pension Fund of the Republic of Uzbekistan. It cannot be used to establish, calculate
          or dispute an actual pension entitlement.
        </p>
      </CardBody>
    </Card>
  )
}
