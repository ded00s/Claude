import { ShieldCheck } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useCountUp } from '@/hooks/useCountUp'
import type { Readiness as ReadinessModel } from '@/lib/pension'

/**
 * Pension readiness.
 *
 * This is explicitly NOT a credit score. It does not rank the citizen against
 * anyone else, it is not shared, and it gates nothing. It measures how complete a
 * contribution record is and how much time remains to act — both of which the
 * person can still change. Every factor therefore states what it measured and
 * what would move it, and the lowest band reads "Getting started", never a
 * judgement. The arc is a progress indicator, not a verdict.
 */
export function Readiness({ readiness }: { readiness: ReadinessModel }) {
  const animated = useCountUp(readiness.total)

  return (
    <Card as="section" className="h-full">
      <CardHeader
        as="h2"
        id="readiness-heading"
        title="Pension readiness"
        description="A supportive summary of how complete your record is — not a rating of you, and never shared with anyone."
      />

      <CardBody className="pt-4">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
          <Dial value={animated} target={readiness.total} />

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <Badge tone={readiness.band.tone} icon={<ShieldCheck size={12} />}>
              {readiness.band.label}
            </Badge>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Your record is in good order. The largest single improvement available to you is
              resolving the 2018–2019 contribution gap.
            </p>
          </div>
        </div>

        <ul className="mt-7 space-y-4">
          {readiness.factors.map((factor) => {
            const pct = (factor.score / factor.max) * 100
            return (
              <li key={factor.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-fg">{factor.label}</span>
                  <span className="tabular shrink-0 text-sm text-fg-muted">
                    {factor.score} / {factor.max}
                  </span>
                </div>

                {/* Meter semantics, so the value is announced rather than inferred
                    from a coloured bar. */}
                <div
                  role="meter"
                  aria-valuenow={Math.round(factor.score)}
                  aria-valuemin={0}
                  aria-valuemax={factor.max}
                  aria-label={`${factor.label}: ${factor.score} out of ${factor.max}`}
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-inset"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="mt-1.5 text-xs leading-relaxed text-fg-subtle">{factor.detail}</p>
              </li>
            )
          })}
        </ul>
      </CardBody>
    </Card>
  )
}

/** Semi-circular progress arc. Purely presentational — the number carries meaning. */
function Dial({ value, target }: { value: number; target: number }) {
  const radius = 52
  const circumference = Math.PI * radius
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100)

  return (
    <div className="relative shrink-0">
      <svg width="140" height="82" viewBox="0 0 140 82" aria-hidden="true">
        <path
          d={`M 18 70 A ${radius} ${radius} 0 0 1 122 70`}
          fill="none"
          stroke="var(--surface-inset)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d={`M 18 70 A ${radius} ${radius} 0 0 1 122 70`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 text-center">
        <span
          className="tabular block text-3xl leading-none font-semibold text-fg"
          role="img"
          aria-label={`Pension readiness score: ${target} out of 100`}
        >
          {Math.round(value)}
        </span>
        <span className="mt-0.5 block text-xs text-fg-subtle">out of 100</span>
      </div>
    </div>
  )
}
