import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'primary' | 'accent' | 'warning' | 'danger'

/**
 * Tone is never the only carrier of meaning — a badge always contains words, and
 * where it marks a state (a gap, a projection) the icon or label repeats it.
 */
export function Badge({
  children,
  tone = 'neutral',
  icon,
  className,
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        tone === 'neutral' && 'bg-surface-inset text-fg-muted',
        tone === 'primary' && 'bg-primary-soft text-primary-soft-fg',
        tone === 'accent' && 'bg-accent-soft text-accent-soft-fg',
        tone === 'warning' && 'bg-warning-soft text-warning-soft-fg',
        tone === 'danger' && 'bg-danger-soft text-danger-soft-fg',
        className,
      )}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  )
}
