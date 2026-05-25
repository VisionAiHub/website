// Crawl https://www.visionaihub.com and capture design + content reference.
// Run: node scripts/crawl-site.mjs [origin]
//
// Outputs to .crawl/:
//   manifest.json                        — discovered routes + per-page metadata
//   pages/<slug>/desktop.png             — full-page screenshot @1440
//   pages/<slug>/mobile.png              — full-page screenshot @390
//   pages/<slug>/desktop-expanded.png    — desktop after expanding accordions/menus
//   pages/<slug>/mobile-menu.png         — mobile with hamburger menu open
//   pages/<slug>/text.md                 — visible text as markdown
//   pages/<slug>/styles.json             — sampled computed styles
//   styles-summary.json                  — palette/fonts aggregated across pages

import { chromium } from 'playwright';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ORIGIN = process.argv[2] || 'https://www.visionaihub.com';
const OUT_DIR = path.resolve('.crawl');
const MAX_PAGES = 30;
const NAV_TIMEOUT = 45_000;

const slugify = (urlPath) =>
  urlPath === '/' || urlPath === ''
    ? 'home'
    : urlPath.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'home';

const sameOrigin = (href, origin) => {
  try {
    const u = new URL(href, origin);
    return u.origin === new URL(origin).origin;
  } catch {
    return false;
  }
};

const normalizePath = (href, origin) => {
  const u = new URL(href, origin);
  // Strip trailing slash (except root), drop hash + query for dedup.
  let p = u.pathname;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
};

async function discoverRoutes(page, origin) {
  const found = new Set(['/']);
  const queue = ['/'];
  const visited = new Set();

  while (queue.length && found.size < MAX_PAGES) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    try {
      await page.goto(origin + current, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
      await page.waitForLoadState('load', { timeout: NAV_TIMEOUT }).catch(() => {});
      await page.waitForTimeout(2500);
    } catch (e) {
      console.warn(`  ! discovery: ${current} failed (${e.message})`);
      continue;
    }

    const hrefs = await page.$$eval('a[href]', (els) => els.map((a) => a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('#')) continue;
      if (!sameOrigin(h, origin)) continue;
      const p = normalizePath(h, origin);
      // Skip likely-binary or asset paths
      if (/\.(png|jpe?g|gif|webp|svg|pdf|zip|mp4|webm|ico)$/i.test(p)) continue;
      if (!found.has(p)) {
        found.add(p);
        queue.push(p);
      }
    }
  }

  return [...found].slice(0, MAX_PAGES);
}

async function autoScroll(page) {
  // Triggers lazy-loaded content (Wix loves this).
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
}

async function extractText(page) {
  return await page.evaluate(() => {
    const lines = [];
    const seen = new Set();
    const push = (prefix, text) => {
      const t = text.replace(/\s+/g, ' ').trim();
      if (!t || seen.has(t)) return;
      seen.add(t);
      lines.push(`${prefix}${t}`);
    };
    document.querySelectorAll('h1, h2, h3, h4, p, li, button, a').forEach((el) => {
      // Skip hidden
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const tag = el.tagName.toLowerCase();
      const text = el.innerText || el.textContent || '';
      if (tag === 'h1') push('# ', text);
      else if (tag === 'h2') push('## ', text);
      else if (tag === 'h3') push('### ', text);
      else if (tag === 'h4') push('#### ', text);
      else if (tag === 'li') push('- ', text);
      else if (tag === 'button') push('[btn] ', text);
      else if (tag === 'a') {
        const href = el.getAttribute('href') || '';
        if (text.length > 0 && text.length < 80) push('', `[${text}](${href})`);
      } else push('', text);
    });
    return lines.join('\n');
  });
}

async function sampleStyles(page) {
  return await page.evaluate(() => {
    const sample = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
      };
    };
    const palette = new Map();
    document.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      for (const prop of ['color', 'backgroundColor', 'borderColor']) {
        const v = cs[prop];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') continue;
        palette.set(v, (palette.get(v) || 0) + 1);
      }
    });
    const topColors = [...palette.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([color, count]) => ({ color, count }));
    return {
      body: sample('body'),
      h1: sample('h1'),
      h2: sample('h2'),
      h3: sample('h3'),
      button: sample('button') || sample('a[role=button]'),
      link: sample('a'),
      topColors,
    };
  });
}

async function tryExpand(page) {
  // Best-effort: click anything that looks like an accordion / "read more" toggle.
  const selectors = [
    '[aria-expanded="false"]',
    'button[aria-controls]',
    '[role="button"][aria-expanded="false"]',
    'details:not([open]) > summary',
  ];
  let clicked = 0;
  for (const sel of selectors) {
    const els = await page.$$(sel);
    for (const el of els.slice(0, 20)) {
      try {
        await el.scrollIntoViewIfNeeded({ timeout: 1000 });
        await el.click({ timeout: 1000, force: true });
        clicked++;
      } catch {
        /* ignore */
      }
    }
  }
  return clicked;
}

async function capturePage(browser, origin, urlPath, outDir) {
  const slug = slugify(urlPath);
  const pageDir = path.join(outDir, 'pages', slug);
  await mkdir(pageDir, { recursive: true });
  const result = { path: urlPath, slug, errors: [] };

  // ---- Desktop pass ----
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  });
  const dPage = await desktopCtx.newPage();
  try {
    await dPage.goto(origin + urlPath, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    await dPage.waitForLoadState('load', { timeout: NAV_TIMEOUT }).catch(() => {});
    await dPage.waitForTimeout(2500);
    await autoScroll(dPage);
    await dPage.waitForTimeout(1500);
    result.title = await dPage.title();
    await dPage.screenshot({ path: path.join(pageDir, 'desktop.png'), fullPage: true });
    await writeFile(path.join(pageDir, 'text.md'), await extractText(dPage), 'utf8');
    await writeFile(
      path.join(pageDir, 'styles.json'),
      JSON.stringify(await sampleStyles(dPage), null, 2),
      'utf8',
    );

    const expanded = await tryExpand(dPage);
    if (expanded > 0) {
      await dPage.waitForTimeout(500);
      await dPage.screenshot({ path: path.join(pageDir, 'desktop-expanded.png'), fullPage: true });
    }
    result.expandedClicks = expanded;
  } catch (e) {
    result.errors.push(`desktop: ${e.message}`);
  } finally {
    await desktopCtx.close();
  }

  // ---- Mobile pass ----
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const mPage = await mobileCtx.newPage();
  try {
    await mPage.goto(origin + urlPath, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    await mPage.waitForLoadState('load', { timeout: NAV_TIMEOUT }).catch(() => {});
    await mPage.waitForTimeout(2500);
    await autoScroll(mPage);
    await mPage.waitForTimeout(1000);
    await mPage.screenshot({ path: path.join(pageDir, 'mobile.png'), fullPage: true });

    // Try opening a hamburger / mobile menu and capture.
    const menuSelectors = [
      'button[aria-label*="menu" i]',
      'button[aria-label*="navigation" i]',
      '[data-testid*="menu" i]',
      'button:has(svg)',
    ];
    for (const sel of menuSelectors) {
      const btn = await mPage.$(sel);
      if (btn) {
        try {
          await btn.click({ timeout: 1500, force: true });
          await mPage.waitForTimeout(400);
          await mPage.screenshot({ path: path.join(pageDir, 'mobile-menu.png'), fullPage: false });
          result.mobileMenuOpened = true;
          break;
        } catch {
          /* try next */
        }
      }
    }
  } catch (e) {
    result.errors.push(`mobile: ${e.message}`);
  } finally {
    await mobileCtx.close();
  }

  return result;
}

async function main() {
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { recursive: true, force: true });
  }
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.join(OUT_DIR, 'pages'), { recursive: true });

  console.log(`Crawling ${ORIGIN}`);
  const browser = await chromium.launch();

  // ---- Discovery ----
  const discCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const discPage = await discCtx.newPage();
  console.log('Discovering routes...');
  const routes = await discoverRoutes(discPage, ORIGIN);
  await discCtx.close();
  console.log(`Found ${routes.length} routes:`);
  routes.forEach((r) => console.log('  ' + r));

  // ---- Capture ----
  const results = [];
  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    console.log(`[${i + 1}/${routes.length}] capturing ${r}`);
    try {
      results.push(await capturePage(browser, ORIGIN, r, OUT_DIR));
    } catch (e) {
      console.error(`  ! ${r} failed: ${e.message}`);
      results.push({ path: r, slug: slugify(r), errors: [e.message] });
    }
  }

  await browser.close();

  // ---- Aggregate styles ----
  const palette = new Map();
  const fonts = new Map();
  for (const r of results) {
    try {
      const stylesPath = path.join(OUT_DIR, 'pages', r.slug, 'styles.json');
      if (!existsSync(stylesPath)) continue;
      const s = JSON.parse(await (await import('node:fs/promises')).readFile(stylesPath, 'utf8'));
      for (const c of s.topColors || []) {
        palette.set(c.color, (palette.get(c.color) || 0) + c.count);
      }
      for (const role of ['body', 'h1', 'h2', 'button']) {
        const f = s[role]?.fontFamily;
        if (f) fonts.set(f, (fonts.get(f) || 0) + 1);
      }
    } catch {
      /* ignore */
    }
  }

  const summary = {
    origin: ORIGIN,
    crawledAt: new Date().toISOString(),
    routes: results,
    topColors: [...palette.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    topFonts: [...fonts.entries()].sort((a, b) => b[1] - a[1]),
  };
  await writeFile(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(summary, null, 2), 'utf8');

  console.log(`\nDone. Output in ${OUT_DIR}`);
  console.log(`  ${results.length} pages captured`);
  console.log(`  Top colors: ${summary.topColors.slice(0, 5).map((c) => c[0]).join(', ')}`);
  console.log(`  Top fonts:  ${summary.topFonts.slice(0, 3).map((f) => f[0]).join(' | ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
