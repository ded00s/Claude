import { Info } from 'lucide-react'

/**
 * Permanent, non-dismissible disclosure. A concept that shows money figures to
 * citizens has to say plainly and continuously that the figures are invented —
 * so this sits above the interface on every view and cannot be closed.
 */
export function DemoBanner() {
  return (
    <div className="border-b border-border bg-warning-soft">
      <div className="mx-auto flex max-w-[1600px] items-start gap-2.5 px-4 py-2 sm:px-6">
        <Info size={15} className="mt-0.5 shrink-0 text-warning-soft-fg" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-warning-soft-fg">
          <span className="font-semibold">Design concept — demonstration data.</span> This is an
          unofficial prototype. All names, employment records and financial figures are fictional,
          and every calculation is illustrative rather than a statutory entitlement.
        </p>
      </div>
    </div>
  )
}
