import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { cn } from '@/lib/cn'
import { formatCount, formatSum } from '@/lib/format'
import { REGIONS, type RegionDatum } from '@/data/analytics'

type Metric = 'ratio' | 'coverage' | 'averagePension'

const METRICS: Record<Metric, { label: string; format: (r: RegionDatum) => string; get: (r: RegionDatum) => number }> = {
  ratio: {
    label: 'Support ratio',
    get: (r) => r.ratio,
    format: (r) => `${r.ratio.toFixed(2)} per pensioner`,
  },
  coverage: {
    label: 'Coverage',
    get: (r) => r.coverage,
    format: (r) => `${Math.round(r.coverage * 100)}% of workforce`,
  },
  averagePension: {
    label: 'Average pension',
    get: (r) => r.averagePension,
    format: (r) => formatSum(r.averagePension),
  },
}

/**
 * Schematic tile cartogram.
 *
 * Deliberately NOT a geographic projection. Equal tiles keep every region equally
 * readable, so Sirdaryo is not visually erased by Karakalpakstan's land area, and
 * no one can mistake the graphic for survey-accurate borders. The caption says so
 * outright. Tiles are keyboard-reachable and each carries its value as text.
 */
export function RegionalMap() {
  const [metric, setMetric] = useState<Metric>('ratio')
  const [active, setActive] = useState<RegionDatum | null>(null)

  const { min, max } = useMemo(() => {
    const values = REGIONS.map(METRICS[metric].get)
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [metric])

  const intensity = (r: RegionDatum) => {
    const v = METRICS[metric].get(r)
    return max === min ? 0.5 : (v - min) / (max - min)
  }

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        title="Regional distribution"
        description="Each tile is one region, sized equally so smaller regions stay legible. Positions echo geography; this is a schematic, not a map."
        action={
          <SegmentedControl
            label="Regional metric"
            value={metric}
            onChange={setMetric}
            options={[
              { value: 'ratio', label: 'Ratio' },
              { value: 'coverage', label: 'Coverage' },
              { value: 'averagePension', label: 'Pension' },
            ]}
          />
        }
      />

      <CardBody className="pt-4">
        {/* Capped width: at full desktop width the tiles would balloon to ~100px
            each and the mostly-empty grid would dominate the page. */}
        <div className="mx-auto grid max-w-3xl grid-cols-8 gap-1.5 sm:gap-2" role="list">
          {Array.from({ length: 4 * 8 }, (_, i) => {
            const col = (i % 8) + 1
            const row = Math.floor(i / 8) + 1
            const region = REGIONS.find((r) => r.col === col && r.row === row)

            if (!region) return <div key={i} aria-hidden="true" />

            const t = intensity(region)
            return (
              <button
                key={region.id}
                type="button"
                role="listitem"
                onMouseEnter={() => setActive(region)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(region)}
                onBlur={() => setActive(null)}
                className={cn(
                  'group relative aspect-square cursor-pointer rounded-md border p-1.5 text-left',
                  'transition-transform duration-150 ease-out hover:scale-[1.04] focus-visible:scale-[1.04]',
                  active?.id === region.id ? 'border-primary' : 'border-transparent',
                )}
                style={{
                  /**
                   * The ramp stops at 48% rather than running to full primary. A
                   * fuller ramp would force the label colour to flip part-way up the
                   * scale, and any threshold-based flip fails contrast for the tiles
                   * sitting either side of the switch. Capping it means one label
                   * colour is legible across the whole range, in both themes.
                   *
                   * Intensity is in any case redundant: every tile prints its own
                   * value, so the reading never depends on colour discrimination.
                   */
                  backgroundColor: `color-mix(in oklab, var(--primary) ${8 + t * 40}%, var(--surface-inset))`,
                }}
              >
                <span className="block truncate text-[9px] leading-tight font-medium text-fg sm:text-[10px]">
                  {region.short}
                </span>
                <span className="tabular absolute right-1.5 bottom-1.5 text-xs font-semibold text-fg sm:text-sm">
                  {metric === 'ratio'
                    ? region.ratio.toFixed(2)
                    : metric === 'coverage'
                      ? `${Math.round(region.coverage * 100)}`
                      : formatSum(region.averagePension, { unit: false })}
                </span>
                <span className="sr-only">
                  {region.name}: {METRICS[metric].format(region)}. {formatCount(region.contributors)}{' '}
                  contributors, {formatCount(region.pensioners)} pensioners.
                </span>
              </button>
            )
          })}
        </div>

        {/* Detail panel keeps a fixed height so hovering never reflows the card. */}
        <div className="mt-5 min-h-[76px] rounded-[var(--radius-control)] border border-border bg-surface-inset p-4">
          {active ? (
            <div className="animate-fade">
              <p className="text-sm font-semibold text-fg">{active.name}</p>
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                <Cell label="Contributors" value={formatCount(active.contributors)} />
                <Cell label="Pensioners" value={formatCount(active.pensioners)} />
                <Cell label="Support ratio" value={active.ratio.toFixed(2)} />
                <Cell label="Average pension" value={formatSum(active.averagePension)} />
              </dl>
            </div>
          ) : (
            <p className="text-sm text-fg-subtle">
              Hover or focus a region to see its figures. Showing{' '}
              <span className="font-medium text-fg-muted">
                {METRICS[metric].label.toLowerCase()}
              </span>
              .
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-fg-subtle">Lower</span>
          <div
            aria-hidden="true"
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                'linear-gradient(to right, color-mix(in oklab, var(--primary) 12%, var(--surface-inset)), var(--primary))',
            }}
          />
          <span className="text-xs text-fg-subtle">Higher</span>
        </div>
      </CardBody>
    </Card>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-fg-subtle">{label}</dt>
      <dd className="tabular mt-0.5 text-sm font-medium text-fg">{value}</dd>
    </div>
  )
}
