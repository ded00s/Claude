import { useState } from 'react'
import { AlertTriangle, Award, Briefcase, ChevronRight, MapPin } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { formatSum, formatSumExact } from '@/lib/format'
import { EMPLOYMENT_HISTORY, type EmploymentEvent } from '@/data/citizen'

/**
 * The contribution record, told as a continuous line rather than a table.
 *
 * A pension is accumulated over decades, so the shape of the record — where it is
 * dense, where it breaks — is itself the information. Gaps are marked in amber,
 * never red: a missing filing is usually an employer's administrative error, and
 * the interface should not imply the citizen did something wrong.
 */
export function Timeline() {
  const [openId, setOpenId] = useState<string | null>('g1')

  return (
    <Card as="section">
      <CardHeader
        as="h2"
        id="timeline-heading"
        title="Your contribution timeline"
        description="Every period recorded against your name. Select any entry to see the detail."
        action={
          <Badge tone="warning" icon={<AlertTriangle size={12} />}>
            1 gap found
          </Badge>
        }
      />

      <CardBody className="pt-4">
        <ol className="relative space-y-1">
          {/* The spine. Decorative — the list semantics carry the order. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[15px] w-px bg-border"
          />

          {EMPLOYMENT_HISTORY.map((event) => (
            <TimelineRow
              key={event.id}
              event={event}
              open={openId === event.id}
              onToggle={() => setOpenId(openId === event.id ? null : event.id)}
            />
          ))}
        </ol>
      </CardBody>
    </Card>
  )
}

function TimelineRow({
  event,
  open,
  onToggle,
}: {
  event: EmploymentEvent
  open: boolean
  onToggle: () => void
}) {
  const isGap = event.kind === 'gap'
  const isMilestone = event.kind === 'milestone'
  const Icon = isGap ? AlertTriangle : isMilestone ? Award : Briefcase
  const period = event.to === null ? `${event.from} — present` : isMilestone ? `${event.from}` : `${event.from} — ${event.to}`

  return (
    <li className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'group flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-control)] py-3 pr-3 pl-0 text-left',
          'transition-colors duration-150 ease-out hover:bg-surface-inset',
        )}
      >
        {/* Node */}
        <span
          aria-hidden="true"
          className={cn(
            'relative z-10 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-surface',
            isGap && 'border-warning text-warning',
            isMilestone && 'border-accent text-accent',
            !isGap && !isMilestone && 'border-primary text-primary',
          )}
        >
          <Icon size={14} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="tabular text-sm font-semibold text-fg">{period}</span>
            {isGap ? (
              <Badge tone="warning">Contribution gap</Badge>
            ) : isMilestone ? (
              <Badge tone="accent">Milestone</Badge>
            ) : null}
          </span>

          <span className="mt-0.5 block truncate text-sm text-fg-muted">
            {event.employer ? (
              <>
                <span className="font-medium text-fg">{event.employer}</span>
                <span className="mx-1.5 text-fg-subtle">·</span>
              </>
            ) : null}
            {event.role}
          </span>
        </span>

        {!isMilestone && !isGap ? (
          <span className="tabular hidden shrink-0 text-right text-sm text-fg-muted sm:block">
            {formatSum(event.contributed, { unit: false })}
            <span className="block text-2xs text-fg-subtle">сўм contributed</span>
          </span>
        ) : null}

        <ChevronRight
          size={16}
          aria-hidden="true"
          className={cn(
            'mt-1.5 shrink-0 text-fg-subtle transition-transform duration-150',
            open && 'rotate-90',
          )}
        />
      </button>

      {open ? (
        <div className="animate-fade mb-2 ml-11 rounded-[var(--radius-control)] border border-border bg-surface-inset p-4">
          {event.note ? <p className="text-sm text-fg-muted">{event.note}</p> : null}

          {!isMilestone && !isGap ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              <Detail label="Average salary" value={`${formatSum(event.monthlySalary)} / month`} />
              <Detail label="Total contributed" value={formatSumExact(event.contributed)} />
              <Detail
                label="Region"
                value={event.region}
                icon={<MapPin size={12} aria-hidden="true" />}
              />
            </dl>
          ) : null}

          {isGap ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="#actions-heading"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] bg-primary px-3.5 py-2 text-sm font-medium text-on-primary transition-colors duration-150 hover:bg-primary-hover"
              >
                Report incorrect information
              </a>
              <a
                href="#actions-heading"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-border-strong px-3.5 py-2 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface"
              >
                Check employment record
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-fg-subtle">{label}</dt>
      <dd className="tabular mt-0.5 flex items-center gap-1 truncate text-sm font-medium text-fg">
        {icon}
        {value}
      </dd>
    </div>
  )
}
