import { cn } from '@/lib/cn'

interface Option<T extends string> {
  value: T
  label: string
}

/**
 * Radio-group semantics rather than tabs: these controls filter a view, they do
 * not switch panels. Arrow-key roving is provided natively by the radio inputs.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex rounded-[var(--radius-control)] border border-border bg-surface-inset p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'cursor-pointer rounded-[calc(var(--radius-control)-2px)] px-3 py-1.5 text-sm font-medium',
              'transition-colors duration-150 ease-out',
              selected
                ? 'bg-surface text-fg shadow-card'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
