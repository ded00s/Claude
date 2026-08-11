import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface StatProps {
  label: string
  value: string
  /** Optional exact figure announced to assistive tech in place of the abbreviation. */
  valueLabel?: string
  unit?: string
  hint?: ReactNode
  icon?: ReactNode
  delta?: { value: number; label?: string }
  /** `hero` is reserved for the single most important figure on a page. */
  size?: 'md' | 'hero'
  /**
   * Render the label/value pair as a <dt>/<dd> group inside a wrapper <div>. Set
   * this when the Stat sits in a <dl>: a definition list whose children carry no
   * dt/dd loses the term/description relationship for screen readers, and is
   * invalid HTML.
   */
  inDefinitionList?: boolean
  className?: string
}

export function Stat({
  label,
  value,
  valueLabel,
  unit,
  hint,
  icon,
  delta,
  size = 'md',
  inDefinitionList = false,
  className,
}: StatProps) {
  const Label = inDefinitionList ? 'dt' : 'div'
  const Value = inDefinitionList ? 'dd' : 'div'

  return (
    <div className={cn('min-w-0', className)}>
      <Label className="flex items-center gap-2">
        {icon ? (
          <span className="text-fg-subtle" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</span>
      </Label>

      <Value>
        <span className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={cn(
              'tabular font-semibold text-fg',
              size === 'hero' ? 'text-4xl sm:text-5xl' : 'text-2xl',
            )}
            // Screen readers get the exact figure; sighted users get the abbreviation.
            aria-label={valueLabel}
          >
            {value}
          </span>
          {unit ? <span className="text-sm text-fg-muted">{unit}</span> : null}
          {delta ? <DeltaPill value={delta.value} label={delta.label} /> : null}
        </span>

        {hint ? <span className="mt-1.5 block text-sm text-fg-muted">{hint}</span> : null}
      </Value>
    </div>
  )
}

/**
 * Direction is carried by an arrow as well as by colour, so the meaning survives
 * for colour-blind users and in monochrome print.
 */
function DeltaPill({ value, label }: { value: number; label?: string }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
        up ? 'bg-accent-soft text-accent-soft-fg' : 'bg-warning-soft text-warning-soft-fg',
      )}
    >
      <Icon size={12} aria-hidden="true" />
      <span className="tabular">{Math.abs(value).toFixed(1)}%</span>
      <span className="sr-only">{up ? 'increase' : 'decrease'}</span>
      {label ? <span className="ml-0.5 font-normal opacity-80">{label}</span> : null}
    </span>
  )
}
