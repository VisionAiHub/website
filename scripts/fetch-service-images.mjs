// Pull the 6 service-card images from https://www.visionaihub.com
// and save them to public/services/<slug>.{ext}
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://www.visionaihub.com';
const OUT = path.resolve('public/services');

const TITLE_TO_SLUG = {
  'Enterprise Knowledge Assistants': 'enterprise-knowledge-assistants',
  'Intelligent Information Extraction': 'information-extraction',
  'Agent-Based Business Process Automation': 'agent-automation',
  'Multi-Modal AI Integration': 'multi-modal-ai',
  'AI-Powered Customer Support': 'customer-support',
  'Privacy-Compliant AI Solutions': 'privacy-compliant',
};

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
});
const page = await ctx.newPage();
await page.goto(ORIGIN, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);

// Trigger lazy loading
await page.evaluate(async () => {
  await new Promise((resolve) => {
    let total = 0;
    const step = 400;
    const timer = setInterval(() => {
      window.scrollBy(0, step);
      total += step;
      if (total >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 100);
  });
});
await page.waitForTimeout(2000);

// Find images near each service title
const candidates = await page.evaluate((titles) => {
  const out = [];
  const all = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div'));
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
  for (const title of titles) {
    let node = all.find((el) => norm(el.textContent) === title);
    if (!node) {
      const matches = all.filter((el) => norm(el.textContent).includes(title));
      node = matches.sort(
        (a, b) => norm(a.textContent).length - norm(b.textContent).length,
      )[0];
    }
    if (!node) continue;
    // Walk up looking for an ancestor that contains an <img>
    let parent = node.parentElement;
    let img = null;
    for (let depth = 0; depth < 8 && parent; depth++) {
      img = parent.querySelector('img[src]');
      if (img) break;
      parent = parent.parentElement;
    }
    if (img) {
      out.push({
        title,
        src: img.currentSrc || img.src,
        alt: img.alt || '',
      });
    } else {
      out.push({ title, src: null });
    }
  }
  return out;
}, Object.keys(TITLE_TO_SLUG));

console.log('Found:');
for (const c of candidates) console.log(` - ${c.title}: ${c.src ?? '<none>'}`);

await browser.close();

// Download each
async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

for (const c of candidates) {
  if (!c.src) continue;
  const slug = TITLE_TO_SLUG[c.title];
  // Bump the Wix fill transform to a larger size.
  const hiRes = c.src.replace(
    /\/v1\/fill\/w_\d+,h_\d+,([^/]+)/,
    '/v1/fill/w_1200,h_600,$1',
  );
  const dest = path.join(OUT, `${slug}.jpg`);
  try {
    await download(hiRes, dest);
    console.log(`✓ ${slug} -> ${path.relative(process.cwd(), dest)} (hi-res)`);
  } catch (e) {
    console.warn(`  hi-res fail (${e.message}), trying original src`);
    try {
      await download(c.src, dest);
      console.log(`✓ ${slug} -> ${path.relative(process.cwd(), dest)}`);
    } catch (e2) {
      console.error(`✗ ${slug}: ${e2.message}`);
    }
  }
}
