import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
let total = 0

for (const theme of ['light', 'dark']) {
  for (const view of ['citizen', 'simulator', 'admin']) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      colorScheme: theme,
    })
    const page = await ctx.newPage()
    await page.goto(`http://127.0.0.1:4173/#${view}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations
    total += violations.length
    console.log(`\n[${theme}/${view}] ${violations.length} violation(s)`)
    for (const v of violations) {
      console.log(`  ${v.impact?.toUpperCase()} ${v.id}: ${v.help}`)
      v.nodes.slice(0, 3).forEach((n) => console.log(`     ${n.target.join(' ')}`))
    }
    await ctx.close()
  }
}

await browser.close()
console.log(total === 0 ? '\n=== No WCAG A/AA violations ===' : `\n=== ${total} total violation(s) ===`)
