import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Eases a number toward its target so headline figures settle rather than snap.
 * Respects prefers-reduced-motion by jumping straight to the value — the number
 * is information, and information must never be withheld for the sake of motion.
 */
export function useCountUp(target: number, duration = 520): number {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prefersReduced()) {
      fromRef.current = target
      setValue(target)
      return
    }

    const from = fromRef.current
    const delta = target - from
    if (delta === 0) return

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic — fast arrival, gentle settle
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + delta * eased
      setValue(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      fromRef.current = value
    }
    // `value` is intentionally excluded: including it would restart the tween on
    // every frame. It is read only in cleanup, to resume from wherever we stopped.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
