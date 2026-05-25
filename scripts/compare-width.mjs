// Compare layout widths between live Wix site and the Vercel deployment.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const VIEWPORT = { width: 1920, height: 1080 };
const OUT = path.resolve('.crawl/compare');
await mkdir(OUT, { recursive: true });

const sites = [
  { name: 'live', url: 'https://www.visionaihub.com' },
  { name: 'vercel', url: 'https://website-kappa-ivory-85.vercel.app' },
];

const browser = await chromium.launch();

for (const s of sites) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log(`\n--- ${s.name} (${s.url}) ---`);
  await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);

  // Top hero screenshot at full viewport (NOT fullPage)
  await page.screenshot({
    path: path.join(OUT, `${s.name}-hero.png`),
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
  });

  // Measure: where does the leftmost main content start, where does it end,
  // and what is the H1 element's bounding rect?
  const measurements = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const headerLogo = document.querySelector('header img, header a img');
    // find the rightmost visible big illustration in top viewport
    const imgs = Array.from(document.querySelectorAll('img'));
    const heroImg = imgs
      .map((i) => ({ el: i, r: i.getBoundingClientRect() }))
      .filter((x) => x.r.top < 900 && x.r.width > 200)
      .sort((a, b) => b.r.width - a.r.width)[0];

    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      h1: h1
        ? {
            text: (h1.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
            left: Math.round(h1.getBoundingClientRect().left),
            right: Math.round(h1.getBoundingClientRect().right),
            width: Math.round(h1.getBoundingClientRect().width),
          }
        : null,
      headerLogo: headerLogo
        ? {
            left: Math.round(headerLogo.getBoundingClientRect().left),
            top: Math.round(headerLogo.getBoundingClientRect().top),
            width: Math.round(headerLogo.getBoundingClientRect().width),
          }
        : null,
      heroImg: heroImg
        ? {
            left: Math.round(heroImg.r.left),
            right: Math.round(heroImg.r.right),
            width: Math.round(heroImg.r.width),
          }
        : null,
    };
  });
  console.log(JSON.stringify(measurements, null, 2));
  await ctx.close();
}

await browser.close();
console.log(`\nScreenshots in ${OUT}`);
