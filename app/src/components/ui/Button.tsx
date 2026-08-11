import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet'
  size?: 'sm' | 'md'
  children: ReactNode
}

/**
 * All variants keep a 44px minimum hit target on touch (`min-h-11`) even though
 * the visual box can be shorter — pointer precision differs from visual density.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium',
        'transition-[background-color,border-color,color,box-shadow] duration-150 ease-out',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm',
        variant === 'primary' &&
          'bg-primary text-on-primary shadow-card hover:bg-primary-hover active:translate-y-px',
        variant === 'secondary' &&
          'border border-border-strong bg-surface text-fg hover:border-primary/40 hover:bg-surface-2 active:translate-y-px',
        variant === 'ghost' && 'text-fg-muted hover:bg-surface-inset hover:text-fg',
        variant === 'quiet' && 'text-primary hover:bg-primary-soft',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
