// Capture only the first viewport (1 screen) of both sites to see how much
// content fits in the fold and where the hero ends.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const VIEWPORT = { width: 1920, height: 1080 };
const OUT = path.resolve('.crawl/compare/fold');
await mkdir(OUT, { recursive: true });

const sites = [
  { name: 'live',   url: 'https://www.visionaihub.com' },
  { name: 'vercel', url: 'https://website-kappa-ivory-85.vercel.app' },
];

const browser = await chromium.launch();
for (const s of sites) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Dismiss cookie banners (live site uses Usercentrics)
  for (const sel of ['button:has-text("Deny")', 'button:has-text("Accept All")']) {
    const btn = await page.$(sel);
    if (btn) {
      await btn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(800);
      break;
    }
  }

  // Viewport-only screenshot (1 window)
  await page.screenshot({
    path: path.join(OUT, `${s.name}-fold.png`),
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
  });

  // Measure: how tall is the hero section, where does the "fold" line cut it
  const m = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const heroSection = h1?.closest('section') || h1?.parentElement;
    return {
      h1Top: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
      h1FontSize: h1 ? getComputedStyle(h1).fontSize : null,
      heroSectionHeight: heroSection ? Math.round(heroSection.getBoundingClientRect().height) : null,
      headerHeight: Math.round(document.querySelector('header')?.getBoundingClientRect().height ?? 0),
      bodyScrollHeight: document.body.scrollHeight,
    };
  });
  console.log(`\n${s.name}:`);
  console.log(JSON.stringify(m, null, 2));
  await ctx.close();
}
await browser.close();
console.log(`\nScreenshots: ${OUT}`);
