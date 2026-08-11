/**
 * Institutional mark. The eight-point star is a geometric motif long present in
 * Uzbek architectural ornament; here it is reduced to a single flat shape at
 * small scale — a quiet nod, not decoration.
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="Pension Fund of the Republic of Uzbekistan"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" className="fill-primary" />
      <path
        d="M16 6.4l2.9 4.3 4.9 1.4-3.1 4.1.2 5.1L16 19.6l-4.9 1.7.2-5.1-3.1-4.1 4.9-1.4z"
        className="fill-accent"
      />
    </svg>
  )
}
