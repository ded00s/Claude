import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const OUT = process.argv[2] || '/tmp/claude-0/-home-user-Claude/2541fc2b-1a1c-5852-8088-d9b8e5fd875b/scratchpad/shots'
mkdirSync(OUT, { recursive: true })

const BASE = 'http://127.0.0.1:4173/'

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'laptop', width: 1024, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
]

const VIEWS = ['citizen', 'simulator', 'admin']

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const errors = []

for (const vp of VIEWPORTS) {
  for (const theme of ['light', 'dark']) {
    // Only capture every view at desktop; smaller widths capture the citizen view.
    const views = vp.name === 'desktop' ? VIEWS : ['citizen']
    for (const view of views) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        colorScheme: theme,
      })
      const page = await ctx.newPage()
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`[${vp.name}/${theme}/${view}] ${m.text()}`)
      })
      page.on('pageerror', (e) => errors.push(`[${vp.name}/${theme}/${view}] PAGEERROR ${e.message}`))

      await page.goto(`${BASE}#${view}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(900)

      const file = `${OUT}/${vp.name}-${theme}-${view}.png`
      await page.screenshot({ path: file, fullPage: vp.name === 'desktop' })
      console.log('shot', file)
      await ctx.close()
    }
  }
}

// Horizontal-overflow check at the narrowest supported width.
const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } })
const page = await ctx.newPage()
for (const view of VIEWS) {
  await page.goto(`${BASE}#${view}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }))
  console.log(
    `overflow@320 ${view}:`,
    overflow.scrollW > overflow.clientW ? `OVERFLOW ${overflow.scrollW}>${overflow.clientW}` : 'ok',
  )
}
await ctx.close()

await browser.close()

if (errors.length) {
  console.log('\n=== CONSOLE ERRORS ===')
  errors.forEach((e) => console.log(e))
} else {
  console.log('\nNo console/page errors.')
}
