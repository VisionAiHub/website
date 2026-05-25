// Screenshot to verify floating CTA appears mid-scroll and disappears at contact section.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('.crawl/local/cta-test');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForLoadState('load').catch(() => {});
await page.waitForTimeout(1500);

// Top — floating CTA hidden
await page.screenshot({ path: path.join(OUT, '1-top.png') });

// Mid — floating CTA visible
await page.evaluate(() => window.scrollTo(0, 1500));
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, '2-mid.png') });

// At contact section — floating CTA hidden again
await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, '3-contact.png') });

await browser.close();
console.log(`Saved: ${OUT}`);
