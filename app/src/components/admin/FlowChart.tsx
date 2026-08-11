import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ChartLegend, ChartTooltip } from '@/components/ui/ChartTooltip'
import { Badge } from '@/components/ui/Badge'
import { useVizTokens } from '@/lib/vizTokens'
import { formatSum, formatSumExact } from '@/lib/format'
import { REVENUE_VS_EXPENDITURE } from '@/data/analytics'

/**
 * Contribution revenue against pension expenditure, with the projected years
 * shaded and labelled. The gap between the two lines is the fund's structural
 * deficit — the single most consequential number for an executive audience, so
 * it is called out in the header rather than left to be inferred.
 */
export function FlowChart() {
  const viz = useVizTokens()
  const firstProjection = REVENUE_VS_EXPENDITURE.find((d) => d.isProjection)?.year
  const lastYear = REVENUE_VS_EXPENDITURE[REVENUE_VS_EXPENDITURE.length - 1]

  const latestActual = [...REVENUE_VS_EXPENDITURE].reverse().find((d) => !d.isProjection)!
  const deficit = latestActual.expenditure - latestActual.revenue

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        title="Contribution revenue and pension expenditure"
        description="Annual flows in so’m. Shaded years are projections."
        action={
          <Badge tone="warning">
            {latestActual.year} shortfall {formatSum(deficit)}
          </Badge>
        }
      />

      <CardBody className="pt-4">
        <ChartLegend
          className="mb-4"
          items={[
            { label: 'Contribution revenue (solid)', color: viz['viz-3'] },
            { label: 'Pension expenditure (solid)', color: viz['viz-4'] },
          ]}
        />

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={REVENUE_VS_EXPENDITURE}
              margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
            >
              <defs>
                <linearGradient id="mfp-rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={viz['viz-3']} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={viz['viz-3']} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={viz['viz-grid']} vertical={false} />

              {firstProjection ? (
                <ReferenceArea
                  x1={firstProjection}
                  x2={lastYear.year}
                  fill={viz['viz-axis']}
                  fillOpacity={0.06}
                  label={{
                    value: 'Projected',
                    position: 'insideTop',
                    fill: viz['viz-axis'],
                    fontSize: 11,
                  }}
                />
              ) : null}

              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: viz['viz-grid'] }}
                tick={{ fill: viz['viz-axis'], fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: viz['viz-axis'], fontSize: 12 }}
                tickFormatter={(v) => formatSum(v, { unit: false })}
                width={52}
              />

              <Tooltip
                cursor={{ stroke: viz['viz-axis'], strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload as (typeof REVENUE_VS_EXPENDITURE)[number]
                  return (
                    <ChartTooltip
                      title={`${d.year}${d.isProjection ? ' · projected' : ''}`}
                      rows={[
                        {
                          label: 'Revenue',
                          value: formatSumExact(d.revenue),
                          color: viz['viz-3'],
                        },
                        {
                          label: 'Expenditure',
                          value: formatSumExact(d.expenditure),
                          color: viz['viz-4'],
                        },
                        {
                          label: 'Shortfall',
                          value: formatSum(d.expenditure - d.revenue),
                        },
                      ]}
                    />
                  )
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="none"
                fill="url(#mfp-rev)"
                isAnimationActive={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={viz['viz-3']}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                animationDuration={400}
              />
              <Line
                type="monotone"
                dataKey="expenditure"
                stroke={viz['viz-4']}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                animationDuration={400}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="sr-only">
          In {latestActual.year}, contribution revenue was {formatSumExact(latestActual.revenue)} and
          pension expenditure was {formatSumExact(latestActual.expenditure)}, a shortfall of{' '}
          {formatSumExact(deficit)}. Both series are projected to rise through {lastYear.year}, with
          expenditure rising faster.
        </p>
      </CardBody>
    </Card>
  )
}
