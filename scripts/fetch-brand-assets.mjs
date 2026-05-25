// Pull the logo + hero robot image and inspect the *actual* font families used
// across hero headings, body text, and nav.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = 'https://www.visionaihub.com';
const OUT = path.resolve('public/brand');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(ORIGIN, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('load', { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3000);

// Lazy-trigger
await page.evaluate(async () => {
  await new Promise((r) => {
    let t = 0;
    const i = setInterval(() => {
      window.scrollBy(0, 400);
      t += 400;
      if (t >= document.body.scrollHeight) {
        clearInterval(i);
        window.scrollTo(0, 0);
        r();
      }
    }, 80);
  });
});
await page.waitForTimeout(1500);

// Find the logo (top of header) and the hero robot illustration
const assets = await page.evaluate(() => {
  // Header logo: top-left small image inside <header> or near top of page
  const imgs = Array.from(document.querySelectorAll('img[src]'));
  const visible = imgs.filter((i) => {
    const r = i.getBoundingClientRect();
    return r.width > 20 && r.height > 20;
  });
  // Sort by topmost
  const topImgs = visible.slice().sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    return ar.top - br.top;
  });
  // Logo: small image in top 100px
  const logo = topImgs.find((i) => {
    const r = i.getBoundingClientRect();
    return r.top < 120 && r.width < 220;
  });
  // Hero robot: large image in top viewport (likely 300+ px wide, top < 800)
  const hero = topImgs.find((i) => {
    const r = i.getBoundingClientRect();
    return r.top < 900 && r.width > 250 && i !== logo;
  });
  return {
    logo: logo ? { src: logo.currentSrc || logo.src, alt: logo.alt, w: logo.naturalWidth, h: logo.naturalHeight } : null,
    hero: hero ? { src: hero.currentSrc || hero.src, alt: hero.alt, w: hero.naturalWidth, h: hero.naturalHeight } : null,
    candidates: topImgs.slice(0, 8).map((i) => ({
      src: (i.currentSrc || i.src).slice(0, 140),
      w: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height),
      top: Math.round(i.getBoundingClientRect().top),
    })),
  };
});

console.log('Detected:', JSON.stringify(assets, null, 2));

// Inspect fonts on key elements
const fonts = await page.evaluate(() => {
  const sample = (sel) => {
    const els = Array.from(document.querySelectorAll(sel));
    return els.slice(0, 5).map((el) => {
      const cs = getComputedStyle(el);
      return {
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        family: cs.fontFamily,
        weight: cs.fontWeight,
        size: cs.fontSize,
      };
    });
  };
  return {
    h1: sample('h1'),
    h2: sample('h2'),
    h3: sample('h3'),
    p: sample('p').slice(0, 3),
    nav: sample('nav a').slice(0, 3),
    button: sample('button').slice(0, 3),
  };
});
console.log('\nFonts in use:');
console.log(JSON.stringify(fonts, null, 2));

await browser.close();

// Download
async function fetchAndSave(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`✓ saved ${path.relative(process.cwd(), dest)} (${buf.length} bytes)`);
}

if (assets.logo?.src) {
  // Bump Wix transform to higher-res when present
  const hi = assets.logo.src.replace(/\/v1\/(fill|fit)\/[^/]+\//, '/v1/fit/w_500,h_500/');
  const ext = (hi.match(/\.(png|jpe?g|svg|webp)/i) || [, 'png'])[1].toLowerCase();
  await fetchAndSave(hi, path.join(OUT, `logo.${ext === 'jpeg' ? 'jpg' : ext}`)).catch(() =>
    fetchAndSave(assets.logo.src, path.join(OUT, 'logo.png')),
  );
}
if (assets.hero?.src) {
  const hi = assets.hero.src.replace(/\/v1\/(fill|fit)\/[^/]+\//, '/v1/fit/w_1600,h_1600/');
  const ext = (hi.match(/\.(png|jpe?g|svg|webp)/i) || [, 'png'])[1].toLowerCase();
  await fetchAndSave(hi, path.join(OUT, `hero.${ext === 'jpeg' ? 'jpg' : ext}`)).catch(() =>
    fetchAndSave(assets.hero.src, path.join(OUT, 'hero.png')),
  );
}
