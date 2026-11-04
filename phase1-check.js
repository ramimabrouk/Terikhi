const { chromium } = require('playwright-core');
const OUT = 'C:\\Users\\LENOVO\\Desktop\\rami\\shots3';
const BASE = 'http://127.0.0.1:4300/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const openCity = (page, id) => page.evaluate((c) => {
  document.querySelector(`path.gov[data-city="${c}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true }));
}, id);

(async () => {
  const fs = require('fs');
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text()); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await wait(1500);
  await page.screenshot({ path: `${OUT}\\1-intro.png` });
  await page.evaluate(() => document.querySelector('.intro .enter').click());
  await wait(2600);
  await page.screenshot({ path: `${OUT}\\2-map.png` });

  const pt = await page.evaluate(() => {
    const b = document.querySelector('path.gov[data-city="sousse"]').getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  });
  await page.mouse.move(pt.x, pt.y);
  await wait(700);
  await page.screenshot({ path: `${OUT}\\3-hover.png` });
  await page.mouse.move(8, 892);

  await openCity(page, 'kairouan');
  await wait(1900);
  await page.screenshot({ path: `${OUT}\\4-detail-top.png` });
  await page.evaluate(() => { document.querySelector('.detail-scroll').scrollTop = 380; });
  await wait(900);
  await page.screenshot({ path: `${OUT}\\5-detail-scrolled.png` });

  await page.evaluate(() => document.querySelector('.detail-toolbar .back-btn').click());
  await wait(1500);
  await page.screenshot({ path: `${OUT}\\6-back.png` });

  const data = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll('path.gov'));
    const ids = paths.map((p) => p.getAttribute('data-city'));
    const labels = Array.from(document.querySelectorAll('.map-label')).map((t) => t.textContent);
    const doc = document.documentElement;
    return {
      count: paths.length,
      uniqueIds: new Set(ids).size,
      ids,
      labels,
      overflow: doc.scrollWidth - doc.clientWidth,
      tiny: Array.from(document.querySelectorAll('.eyebrow, .map-credit, .meta-strip dt, .row-num, .footer, .tag'))
        .map((el) => parseFloat(getComputedStyle(el).fontSize))
        .filter((n) => n < 10).length,
    };
  });
  console.log('DESKTOP', JSON.stringify(data));

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mp = await mctx.newPage();
  mp.on('pageerror', (e) => errors.push('MOBILE PAGEERROR ' + e.message));
  await mp.goto(BASE, { waitUntil: 'networkidle' });
  await wait(1400);
  await mp.evaluate(() => document.querySelector('.intro .enter').click());
  await wait(2500);
  await mp.screenshot({ path: `${OUT}\\7-mobile-map.png` });
  await openCity(mp, 'tozeur');
  await wait(1800);
  await mp.screenshot({ path: `${OUT}\\8-mobile-detail.png` });
  await mp.evaluate(() => { document.querySelector('.detail-scroll').scrollTop = 500; });
  await wait(900);
  await mp.screenshot({ path: `${OUT}\\9-mobile-detail-scrolled.png` });

  const mdata = await mp.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    mapPane: Math.round(document.querySelector('.map-pane').getBoundingClientRect().height),
    detailScroll: Math.round(document.querySelector('.detail-scroll').getBoundingClientRect().height),
    tabs: (() => { const r = document.querySelector('.section-index'); return r ? `${r.scrollWidth}/${r.clientWidth}` : null; })(),
  }));
  console.log('MOBILE', JSON.stringify(mdata));
  console.log('ERRORS:', errors.length ? JSON.stringify(errors, null, 1) : 'none');
  await browser.close();
})();
