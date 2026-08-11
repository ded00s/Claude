import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
  /** `inset` sits back into the page; `raised` lifts for primary surfaces. */
  variant?: 'default' | 'inset' | 'raised'
  as?: 'div' | 'section' | 'article'
}

export function Card({ children, className, variant = 'default', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-[var(--radius-card)] border',
        variant === 'default' && 'border-border bg-surface shadow-card',
        variant === 'inset' && 'border-border bg-surface-inset',
        variant === 'raised' && 'border-border bg-surface shadow-raised',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** Right-aligned slot for controls, legends or badges. */
  action?: ReactNode
  className?: string
  /** Heading level — set this so each page keeps a valid heading outline. */
  as?: 'h2' | 'h3' | 'h4'
  id?: string
}

export function CardHeader({
  title,
  description,
  action,
  className,
  as: Heading = 'h3',
  id,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 sm:px-6 sm:pt-6',
        className,
      )}
    >
      <div className="min-w-0">
        <Heading id={id} className="text-base font-semibold text-fg">
          {title}
        </Heading>
        {description ? (
          <p className="mt-1 max-w-prose text-sm text-fg-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-5 sm:px-6 sm:py-6', className)}>{children}</div>
}
