import {
  Banknote,
  Building2,
  Scale,
  TrendingDown,
  Users,
  Wallet,
} from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import { Stat } from '@/components/ui/Stat'
import { Badge } from '@/components/ui/Badge'
import { RegionalMap } from '@/components/admin/RegionalMap'
import { FlowChart } from '@/components/admin/FlowChart'
import { AgeStructure, RevenueMix, SupportRatioTrend } from '@/components/admin/Demographics'
import { formatCount, formatSum, formatSumExact } from '@/lib/format'
import { NATIONAL } from '@/data/analytics'

/**
 * Executive analytics.
 *
 * A different reading posture from the citizen view: this audience scans for
 * exceptions, so the KPI band leads with movement (deltas) rather than levels,
 * and the two charts that carry policy weight — the revenue/expenditure gap and
 * the support-ratio trend — are given the most space.
 */
export function AdminView() {
  const kpis = [
    {
      label: 'Active contributors',
      value: formatCount(NATIONAL.activeContributors),
      valueLabel: `${NATIONAL.activeContributors.toLocaleString('en-US')} active contributors`,
      icon: <Users size={14} />,
      delta: NATIONAL.deltas.contributors,
      hint: 'Filing in the last quarter',
    },
    {
      label: 'Pensioners',
      value: formatCount(NATIONAL.pensioners),
      valueLabel: `${NATIONAL.pensioners.toLocaleString('en-US')} pensioners`,
      icon: <Building2 size={14} />,
      delta: NATIONAL.deltas.pensioners,
      hint: 'Receiving a monthly benefit',
    },
    {
      label: 'Average pension',
      value: formatSum(NATIONAL.averagePension, { unit: false }),
      valueLabel: formatSumExact(NATIONAL.averagePension),
      icon: <Wallet size={14} />,
      delta: NATIONAL.deltas.averagePension,
      hint: 'сўм per month, nominal',
    },
    {
      label: 'Contribution revenue',
      value: formatSum(NATIONAL.contributionRevenue, { unit: false }),
      valueLabel: formatSumExact(NATIONAL.contributionRevenue),
      icon: <Banknote size={14} />,
      delta: NATIONAL.deltas.revenue,
      hint: 'сўм, annualised',
    },
    {
      label: 'Pension expenditure',
      value: formatSum(NATIONAL.pensionExpenditure, { unit: false }),
      valueLabel: formatSumExact(NATIONAL.pensionExpenditure),
      icon: <TrendingDown size={14} />,
      delta: NATIONAL.deltas.expenditure,
      hint: 'сўм, annualised',
    },
    {
      label: 'Support ratio',
      value: NATIONAL.supportRatio.toFixed(2),
      icon: <Scale size={14} />,
      delta: NATIONAL.deltas.supportRatio,
      hint: 'Contributors per pensioner',
    },
  ]

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge tone="primary">Internal</Badge>
            <Badge tone="neutral">Updated 11 August 2026</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-fg sm:text-3xl">
            Fund analytics
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            National position, regional distribution and medium-term outlook for the pension
            system. All figures on this page are synthetic demonstration data.
          </p>
        </div>
      </header>

      {/* KPI band — the whole national picture in one scan line. */}
      <Card variant="raised">
        <CardBody className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 xl:grid-cols-6">
          {kpis.map((kpi) => (
            <Stat
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              valueLabel={kpi.valueLabel}
              icon={kpi.icon}
              delta={{ value: kpi.delta }}
              hint={<span className="text-xs">{kpi.hint}</span>}
            />
          ))}
        </CardBody>
      </Card>

      <FlowChart />

      <div className="grid gap-6 xl:grid-cols-2">
        <SupportRatioTrend />
        <AgeStructure />
      </div>

      <RegionalMap />

      {/* items-start: the donut is much shorter than the outlook list, and
          stretching it to match leaves a large empty panel. */}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <RevenueMix />
        <OutlookNotes />
      </div>
    </div>
  )
}

/**
 * The narrative layer. Executives act on interpretation, not on axes — so the
 * dashboard states what it believes the charts mean, and separates observation
 * from recommendation so the two are never confused.
 */
function OutlookNotes() {
  const notes = [
    {
      title: 'Expenditure is growing faster than revenue',
      body: 'Expenditure rose 16.8% year on year against 14.2% for revenue. On the current trajectory the annual shortfall widens from 5.7 to roughly 15.3 trillion so’m by 2029.',
      tone: 'attention' as const,
    },
    {
      title: 'The support ratio crosses the planning threshold in 2027',
      body: 'At 1.26 contributors per pensioner the ratio falls below the 1.25 planning threshold within two years, driven by the 55–64 cohort moving into benefit.',
      tone: 'attention' as const,
    },
    {
      title: 'Formal coverage is the largest available lever',
      body: 'Coverage ranges from 41% in Surkhandarya to 78% in Tashkent City. Closing half of that spread in the four lowest regions would add an estimated 340,000 contributors.',
      tone: 'neutral' as const,
    },
    {
      title: 'Voluntary contributions remain a small share',
      body: 'At 7.3% of revenue, voluntary contributions are the smallest category but the fastest growing, suggesting room for a targeted digital enrolment campaign.',
      tone: 'neutral' as const,
    },
  ]

  return (
    <Card as="section" className="h-full">
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-base font-semibold text-fg">Outlook</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Analyst reading of the series above. Interpretation, not policy.
        </p>
      </div>
      <CardBody className="pt-4">
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.title}
              className={`rounded-[var(--radius-control)] border p-4 ${
                note.tone === 'attention'
                  ? 'border-warning/30 bg-warning-soft/40'
                  : 'border-border bg-surface-inset'
              }`}
            >
              <p className="text-sm font-medium text-fg">{note.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{note.body}</p>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}
