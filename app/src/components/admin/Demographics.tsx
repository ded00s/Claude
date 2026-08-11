import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ChartLegend, ChartTooltip } from '@/components/ui/ChartTooltip'
import { useVizTokens } from '@/lib/vizTokens'
import { formatCount, formatPercent } from '@/lib/format'
import { AGE_STRUCTURE, REVENUE_MIX, SUPPORT_RATIO_TREND } from '@/data/analytics'

/** Contributors and pensioners by age band — the shape of the demographic problem. */
export function AgeStructure() {
  const viz = useVizTokens()

  return (
    <Card as="section" className="h-full">
      <CardHeader
        as="h2"
        title="Age structure"
        description="Contributors and pensioners by age band."
      />
      <CardBody className="pt-4">
        <ChartLegend
          className="mb-4"
          items={[
            { label: 'Contributors', color: viz['viz-2'] },
            { label: 'Pensioners', color: viz['viz-5'] },
          ]}
        />
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AGE_STRUCTURE} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid stroke={viz['viz-grid']} vertical={false} />
              <XAxis
                dataKey="bracket"
                tickLine={false}
                axisLine={{ stroke: viz['viz-grid'] }}
                tick={{ fill: viz['viz-axis'], fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: viz['viz-axis'], fontSize: 11 }}
                tickFormatter={(v) => formatCount(v)}
                width={44}
              />
              <Tooltip
                cursor={{ fill: 'var(--surface-inset)' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload as (typeof AGE_STRUCTURE)[number]
                  return (
                    <ChartTooltip
                      title={`Age ${label}`}
                      rows={[
                        {
                          label: 'Contributors',
                          value: formatCount(d.contributors),
                          color: viz['viz-2'],
                        },
                        {
                          label: 'Pensioners',
                          value: formatCount(d.pensioners),
                          color: viz['viz-5'],
                        },
                      ]}
                    />
                  )
                }}
              />
              <Bar dataKey="contributors" fill={viz['viz-2']} radius={[3, 3, 0, 0]} />
              <Bar dataKey="pensioners" fill={viz['viz-5']} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

/** Contributors per pensioner over time — the trend that drives everything else. */
export function SupportRatioTrend() {
  const viz = useVizTokens()
  const firstProjection = SUPPORT_RATIO_TREND.find((d) => d.isProjection)?.year

  return (
    <Card as="section" className="h-full">
      <CardHeader
        as="h2"
        title="Contribution-to-benefit ratio"
        description="Active contributors per pensioner. A ratio approaching 1.0 means each pensioner is supported by roughly one contributor."
      />
      <CardBody className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SUPPORT_RATIO_TREND} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid stroke={viz['viz-grid']} vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: viz['viz-grid'] }}
                tick={{ fill: viz['viz-axis'], fontSize: 11 }}
              />
              <YAxis
                domain={[1, 1.7]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: viz['viz-axis'], fontSize: 11 }}
                width={36}
              />
              <ReferenceLine
                y={1.25}
                stroke={viz['viz-4']}
                strokeDasharray="4 4"
                label={{
                  value: 'Planning threshold 1.25',
                  position: 'insideBottomRight',
                  fill: viz['viz-4'],
                  fontSize: 10,
                }}
              />
              {firstProjection ? (
                <ReferenceLine
                  x={firstProjection}
                  stroke={viz['viz-axis']}
                  strokeDasharray="3 3"
                  label={{
                    value: 'Projected',
                    position: 'top',
                    fill: viz['viz-axis'],
                    fontSize: 10,
                  }}
                />
              ) : null}
              <Tooltip
                cursor={{ stroke: viz['viz-axis'], strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload as (typeof SUPPORT_RATIO_TREND)[number]
                  return (
                    <ChartTooltip
                      title={`${d.year}${d.isProjection ? ' · projected' : ''}`}
                      rows={[
                        {
                          label: 'Contributors per pensioner',
                          value: d.ratio.toFixed(2),
                          color: viz['viz-1'],
                        },
                      ]}
                    />
                  )
                }}
              />
              <Line
                type="monotone"
                dataKey="ratio"
                stroke={viz['viz-1']}
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: viz['viz-1'], strokeWidth: 0 }}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

/** Where contribution revenue comes from. */
export function RevenueMix() {
  const viz = useVizTokens()
  // Hues alternate rather than run through the blues in sequence, so adjacent
  // slices stay separable without relying on the legend.
  const palette = [viz['viz-1'], viz['viz-3'], viz['viz-4'], viz['viz-2'], viz['viz-5']]

  return (
    <Card as="section">
      <CardHeader as="h2" title="Revenue by payer category" description="Share of total contribution revenue." />
      <CardBody className="pt-4">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-[180px] w-[180px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_MIX}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  animationDuration={400}
                >
                  {REVENUE_MIX.map((entry, i) => (
                    <Cell key={entry.name} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload as (typeof REVENUE_MIX)[number]
                    return (
                      <ChartTooltip
                        title={d.name}
                        rows={[{ label: 'Share of revenue', value: formatPercent(d.value, 1) }]}
                      />
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* The legend doubles as the data table — every slice is readable as text. */}
          <ul className="w-full min-w-0 space-y-2">
            {REVENUE_MIX.map((entry, i) => (
              <li key={entry.name} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: palette[i % palette.length] }}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-fg-muted">{entry.name}</span>
                <span className="tabular shrink-0 text-sm font-semibold text-fg">
                  {formatPercent(entry.value, 1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  )
}
