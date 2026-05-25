import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.visionaihub.com', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('load').catch(() => {});
await page.waitForTimeout(3000);
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
    }, 100);
  });
});
await page.waitForTimeout(1500);

const matches = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div').forEach((el) => {
    const t = el.textContent || '';
    if (t.toLowerCase().includes('agent') && t.length < 200) {
      out.push({
        tag: el.tagName,
        text: t.slice(0, 150),
        codes: [...t.slice(0, 50)].map((c) => c.charCodeAt(0)).join(','),
      });
    }
  });
  return out.slice(0, 20);
});
console.log(JSON.stringify(matches, null, 2));
await browser.close();
