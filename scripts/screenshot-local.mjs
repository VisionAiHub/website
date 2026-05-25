import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3000';
const ROUTES = ['/', '/privacy-policy', '/impressum'];
const OUT = path.resolve('.crawl/local');

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/+/, '').replace(/\//g, '-'));

const browser = await chromium.launch();

for (const route of ROUTES) {
  const dir = path.join(OUT, slug(route));
  await mkdir(dir, { recursive: true });

  for (const [label, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(dir, `${label}.png`), fullPage: true });
      console.log(`✓ ${route} ${label}`);
    } catch (e) {
      console.error(`✗ ${route} ${label}: ${e.message}`);
    } finally {
      await ctx.close();
    }
  }
}

await browser.close();
console.log(`\nOutput: ${OUT}`);
