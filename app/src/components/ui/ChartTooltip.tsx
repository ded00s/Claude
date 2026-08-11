import type { ReactNode } from 'react'

interface Row {
  label: string
  value: string
  /** Swatch colour. Always paired with a written label — never colour alone. */
  color?: string
  /** Rendered as a dashed swatch, matching a dashed series in the chart. */
  dashed?: boolean
}

/**
 * A single tooltip shell shared by every chart, so hover feedback is identical
 * across the product. Recharts passes it through the `content` prop.
 */
export function ChartTooltip({
  title,
  rows,
  footer,
}: {
  title: ReactNode
  rows: Row[]
  footer?: ReactNode
}) {
  return (
    <div className="pointer-events-none min-w-44 rounded-[var(--radius-control)] border border-border bg-surface p-3 shadow-float">
      <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">{title}</p>
      <div className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <span className="flex items-center gap-2 text-sm text-fg-muted">
              {row.color ? (
                <span
                  aria-hidden="true"
                  className="inline-block h-0.5 w-3 shrink-0 rounded-full"
                  style={
                    row.dashed
                      ? {
                          backgroundImage: `repeating-linear-gradient(to right, ${row.color} 0 3px, transparent 3px 6px)`,
                        }
                      : { backgroundColor: row.color }
                  }
                />
              ) : null}
              {row.label}
            </span>
            <span className="tabular text-sm font-semibold text-fg">{row.value}</span>
          </div>
        ))}
      </div>
      {footer ? <div className="mt-2 border-t border-border pt-2 text-xs text-fg-subtle">{footer}</div> : null}
    </div>
  )
}

/** Shared legend row. Communicates line style, not just colour. */
export function ChartLegend({
  items,
  className,
}: {
  items: Array<{ label: string; color: string; dashed?: boolean; area?: boolean }>
  className?: string
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className ?? ''}`}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs text-fg-muted">
          <span
            aria-hidden="true"
            className="inline-block shrink-0 rounded-full"
            style={
              item.area
                ? {
                    width: 12,
                    height: 10,
                    borderRadius: 2,
                    backgroundColor: item.color,
                    opacity: 0.18,
                    border: `1px solid ${item.color}`,
                  }
                : item.dashed
                  ? {
                      width: 14,
                      height: 2,
                      backgroundImage: `repeating-linear-gradient(to right, ${item.color} 0 4px, transparent 4px 8px)`,
                    }
                  : { width: 14, height: 2, backgroundColor: item.color }
            }
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
