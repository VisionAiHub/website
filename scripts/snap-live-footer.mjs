import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('.crawl/compare');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
await page.goto('https://www.visionaihub.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);

// Dismiss cookie banner if present
for (const sel of ['button:has-text("Accept All")', 'button:has-text("Deny")', 'button:has-text("Save Settings")']) {
  const btn = await page.$(sel);
  if (btn) {
    await btn.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(800);
    break;
  }
}

// Trigger lazy load
await page.evaluate(async () => {
  await new Promise((r) => {
    let t = 0;
    const i = setInterval(() => {
      window.scrollBy(0, 600);
      t += 600;
      if (t >= document.body.scrollHeight) {
        clearInterval(i);
        r();
      }
    }, 80);
  });
});
await page.waitForTimeout(1500);

// Scroll to bottom and capture the footer area
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);

await page.screenshot({
  path: path.join(OUT, 'live-footer.png'),
  clip: { x: 0, y: 1080 - 600, width: 1920, height: 600 },
});

// Also full-page for fallback
await page.screenshot({ path: path.join(OUT, 'live-fullpage.png'), fullPage: true });

await browser.close();
console.log('done');
