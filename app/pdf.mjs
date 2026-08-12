import { chromium } from 'playwright'

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
const page = await ctx.newPage()

await page.goto('file:///home/user/Claude/infographics/pension-strategy-ru.html', {
  waitUntil: 'networkidle',
})
await page.emulateMedia({ media: 'print' })
await page.waitForTimeout(700)

// Лист PDF ровно по фактическому размеру макета — тогда содержимое
// не разрывается между страницами.
const box = await page.evaluate(() => {
  const el = document.querySelector('.sheet')
  const r = el.getBoundingClientRect()
  return { w: Math.ceil(r.width), h: Math.ceil(r.height) }
})
console.log('layout:', box.w, 'x', box.h)

await page.pdf({
  path: '/home/user/Claude/infographics/pension-strategy-ru.pdf',
  width: `${box.w}px`,
  height: `${box.h}px`,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  pageRanges: '1',
})

await browser.close()
console.log('pdf written')
