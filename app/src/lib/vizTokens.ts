import { useEffect, useState } from 'react'

/**
 * Recharts needs concrete colour strings, not CSS custom properties, for SVG
 * strokes and fills. This resolves the design tokens from the live stylesheet so
 * charts stay bound to the same palette as the rest of the interface, and
 * re-resolves them whenever the theme class changes.
 */
const TOKENS = [
  'viz-current',
  'viz-optimised',
  'viz-band',
  'viz-grid',
  'viz-axis',
  'viz-1',
  'viz-2',
  'viz-3',
  'viz-4',
  'viz-5',
  'viz-6',
] as const

export type VizTokens = Record<(typeof TOKENS)[number], string>

function read(): VizTokens {
  const styles = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    TOKENS.map((name) => [name, styles.getPropertyValue(`--${name}`).trim()]),
  ) as VizTokens
}

export function useVizTokens(): VizTokens {
  const [tokens, setTokens] = useState<VizTokens>(read)

  useEffect(() => {
    const observer = new MutationObserver(() => setTokens(read()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return tokens
}
