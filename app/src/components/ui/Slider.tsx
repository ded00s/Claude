import { useId } from 'react'
import { cn } from '@/lib/cn'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  /** Human-readable current value, e.g. "8.4 mln so'm". */
  display: string
  /** Optional guidance shown under the control. */
  hint?: string
  className?: string
}

/**
 * A labelled range input. The native <input type="range"> is kept deliberately:
 * it is keyboard-operable, announced correctly, and honours OS-level pointer
 * settings for free. Only the visuals are restyled.
 */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
  className,
}: SliderProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <output htmlFor={id} className="tabular text-sm font-semibold text-primary">
          {display}
        </output>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={hint ? hintId : undefined}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mfp-range w-full cursor-pointer"
        style={{ ['--pct' as string]: `${pct}%` }}
      />

      {hint ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
