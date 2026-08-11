import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Table2, TrendingUp } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ChartLegend, ChartTooltip } from '@/components/ui/ChartTooltip'
import { Button } from '@/components/ui/Button'
import { useVizTokens } from '@/lib/vizTokens'
import { formatSum, formatSumExact } from '@/lib/format'
import type { ForecastPoint } from '@/lib/pension'

/**
 * Pension entitlement as a function of the age at which the citizen retires.
 *
 * Three encodings, each independent of colour: the band shows uncertainty, the
 * solid line the current path, the dashed line the optimised path. An equivalent
 * data table is one keystroke away for anyone who cannot read the chart.
 */
export function ForecastChart({
  data,
  showOptimised,
  selectedAge,
}: {
  data: ForecastPoint[]
  showOptimised: boolean
  selectedAge: number
}) {
  const viz = useVizTokens()
  const [showTable, setShowTable] = useState(false)

  const legend = useMemo(
    () => [
      { label: 'Current path (solid)', color: viz['viz-current'] },
      ...(showOptimised
        ? [{ label: 'Optimised path (dashed)', color: viz['viz-optimised'], dashed: true }]
        : []),
      { label: 'Range of uncertainty', color: viz['viz-band'], area: true },
    ],
    [viz, showOptimised],
  )

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        id="forecast-heading"
        title="Pension forecast"
        description="How your projected monthly pension changes with the age you retire. The shaded range widens further into the future, because distant estimates are less certain."
        action={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTable((s) => !s)}
            aria-pressed={showTable}
          >
            {showTable ? <TrendingUp size={15} /> : <Table2 size={15} />}
            {showTable ? 'Show chart' : 'Show data table'}
          </Button>
        }
      />

      <CardBody className="pt-4">
        <ChartLegend items={legend} className="mb-4" />

        {showTable ? (
          <ForecastTable data={data} showOptimised={showOptimised} />
        ) : (
          <>
            <div className="h-[340px] w-full sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {/* Top margin leaves room for the "Selected" reference-line label. */}
                <ComposedChart data={data} margin={{ top: 20, right: 8, bottom: 4, left: 0 }}>
                  <defs>
                    <linearGradient id="mfp-band" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={viz['viz-band']} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={viz['viz-band']} stopOpacity={0.06} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={viz['viz-grid']} vertical={false} />

                  <XAxis
                    dataKey="age"
                    tickLine={false}
                    axisLine={{ stroke: viz['viz-grid'] }}
                    tick={{ fill: viz['viz-axis'], fontSize: 12 }}
                    tickFormatter={(v) => `${v}`}
                    label={{
                      value: 'Age at retirement',
                      position: 'insideBottom',
                      offset: -2,
                      fill: viz['viz-axis'],
                      fontSize: 11,
                    }}
                    height={44}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: viz['viz-axis'], fontSize: 12 }}
                    tickFormatter={(v) => formatSum(v, { unit: false })}
                    width={56}
                  />

                  <Tooltip
                    cursor={{ stroke: viz['viz-axis'], strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const p = payload[0].payload as ForecastPoint
                      return (
                        <ChartTooltip
                          title={`Retiring at ${p.age} · ${p.year}`}
                          rows={[
                            {
                              label: 'Current path',
                              value: formatSumExact(p.current),
                              color: viz['viz-current'],
                            },
                            ...(showOptimised
                              ? [
                                  {
                                    label: 'Optimised path',
                                    value: formatSumExact(p.optimised),
                                    color: viz['viz-optimised'],
                                    dashed: true,
                                  },
                                ]
                              : []),
                            {
                              label: 'Range',
                              value: `${formatSum(p.bandLow)} – ${formatSum(p.bandHigh)}`,
                            },
                          ]}
                          footer="Illustrative projection, not a statutory entitlement."
                        />
                      )
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="bandHigh"
                    stroke="none"
                    fill="url(#mfp-band)"
                    isAnimationActive={false}
                    activeDot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="bandLow"
                    stroke="none"
                    fill="var(--surface)"
                    isAnimationActive={false}
                    activeDot={false}
                  />

                  <ReferenceLine
                    x={selectedAge}
                    stroke={viz['viz-axis']}
                    strokeDasharray="4 4"
                    label={{
                      value: 'Selected',
                      position: 'top',
                      fill: viz['viz-axis'],
                      fontSize: 11,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke={viz['viz-current']}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                    animationDuration={400}
                  />
                  {showOptimised ? (
                    <Line
                      type="monotone"
                      dataKey="optimised"
                      stroke={viz['viz-optimised']}
                      strokeWidth={2.5}
                      strokeDasharray="6 4"
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                      animationDuration={400}
                    />
                  ) : null}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Equivalent description for anyone not reading the graphic. */}
            <p className="sr-only">
              Line chart. Retiring at age {data[0]?.age} would give a projected monthly pension of{' '}
              {formatSumExact(data[0]?.current ?? 0)}, rising to{' '}
              {formatSumExact(data[data.length - 1]?.current ?? 0)} if you retire at age{' '}
              {data[data.length - 1]?.age}. Use the data table button for exact figures at every
              age.
            </p>
          </>
        )}
      </CardBody>
    </Card>
  )
}

function ForecastTable({
  data,
  showOptimised,
}: {
  data: ForecastPoint[]
  showOptimised: boolean
}) {
  return (
    <div className="max-h-[400px] overflow-auto rounded-[var(--radius-control)] border border-border">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Projected monthly pension by age at retirement, in so'm
        </caption>
        <thead className="sticky top-0 bg-surface-inset">
          <tr>
            <Th>Age</Th>
            <Th>Year</Th>
            <Th align="right">Current path</Th>
            {showOptimised ? <Th align="right">Optimised path</Th> : null}
            <Th align="right">Range</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.age} className="border-t border-border">
              <Td>{p.age}</Td>
              <Td>{p.year}</Td>
              <Td align="right">{formatSum(p.current)}</Td>
              {showOptimised ? <Td align="right">{formatSum(p.optimised)}</Td> : null}
              <Td align="right" muted>
                {formatSum(p.bandLow, { unit: false })} – {formatSum(p.bandHigh, { unit: false })}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <th
      scope="col"
      className={`px-3 py-2 text-xs font-semibold tracking-wide text-fg-muted uppercase ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  align,
  muted,
}: {
  children: React.ReactNode
  align?: 'right'
  muted?: boolean
}) {
  return (
    <td
      className={`tabular px-3 py-2 ${align === 'right' ? 'text-right' : 'text-left'} ${
        muted ? 'text-fg-subtle' : 'text-fg'
      }`}
    >
      {children}
    </td>
  )
}
