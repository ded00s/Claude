/**
 * Verifies the contrast ratios asserted in src/index.css.
 * Run: node contrast-check.mjs
 */

const hex = (h) => {
  const s = h.replace('#', '')
  const n = s.length === 3 ? s.split('').map((c) => c + c).join('') : s
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
}

const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

const LIGHT = {
  surface: '#ffffff',
  bg: '#f6f8fb',
  inset: '#f2f5f9',
  fg: '#0b1b33',
  fgMuted: '#4d5b73',
  fgSubtle: '#606e83',
  primary: '#123c78',
  accent: '#0e7f52',
  warning: '#b45309',
  danger: '#b42318',
  onPrimary: '#ffffff',
}

const DARK = {
  surface: '#0d1728',
  bg: '#070e1b',
  inset: '#0a1322',
  fg: '#e6edf8',
  fgMuted: '#9daeca',
  fgSubtle: '#7f90ac',
  primary: '#5b94e0',
  accent: '#34bc82',
  warning: '#e59b3d',
  danger: '#f0705f',
  onPrimary: '#04101f',
}

// [label, fg, bg, minimum required]
// 4.5 = WCAG AA body text; 3.0 = AA large text / UI component boundaries.
const cases = (T, on) => [
  ['body text on surface', T.fg, T.surface, 4.5],
  ['body text on page bg', T.fg, T.bg, 4.5],
  ['muted text on surface', T.fgMuted, T.surface, 4.5],
  ['muted text on inset', T.fgMuted, T.inset, 4.5],
  ['subtle text on surface', T.fgSubtle, T.surface, 4.5],
  ['subtle text on inset', T.fgSubtle, T.inset, 4.5],
  ['primary text on surface', T.primary, T.surface, 4.5],
  ['accent text on surface', T.accent, T.surface, 4.5],
  ['warning text on surface', T.warning, T.surface, 4.5],
  ['danger text on surface', T.danger, T.surface, 4.5],
  ['on-primary on primary', T.onPrimary, T.primary, 4.5],
  ['primary as UI boundary', T.primary, T.surface, 3.0],
].map(([label, fg, bg, min]) => [`${on}: ${label}`, fg, bg, min])

let failures = 0
for (const [label, fg, bg, min] of [...cases(LIGHT, 'light'), ...cases(DARK, 'dark')]) {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) failures++
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (min ${min.toFixed(1)})  ${label}`,
  )
}

console.log(failures === 0 ? '\nAll contrast pairs pass.' : `\n${failures} FAILING PAIR(S).`)
process.exit(failures === 0 ? 0 : 1)
