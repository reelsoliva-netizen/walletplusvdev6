// Usage: npm run generate:screens
// Requires: npm i --save-dev puppeteer
// Captures phone and tablet screenshots from a running preview server at http://localhost:4173/

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'store_assets', 'play_store', 'screenshots');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function capture(viewport, prefix) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });

  // Ensure app root loaded
  await page.waitForSelector('#root');

  const shots = [
    { label: 'Home', selectorText: 'Home' },
    { label: 'Transactions', selectorText: 'Transactions' },
    { label: 'Analysis', selectorText: 'Analysis' },
    { label: 'Accounts', selectorText: 'Accounts' },
    { label: 'Settings', selectorText: 'Settings' },
  ];

  let index = 1;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const s of shots) {
    // Click bottom nav item by label
    await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const btn = buttons.find(b => b.textContent && b.textContent.trim() === text);
      if (btn) btn.click();
    }, s.selectorText);

    // Small settle delay
    await sleep(400);
    const file = path.join(OUT_DIR, `${prefix}-${String(index).padStart(2, '0')}.png`);
    await page.screenshot({ path: file, fullPage: true });
    index++;
  }

  await browser.close();
}

async function main() {
  ensureDir(OUT_DIR);
  // Phone
  await capture({ width: 1080, height: 1920, deviceScaleFactor: 2 }, 'phone');
  // Tablet (7-inch approx)
  await capture({ width: 1200, height: 1920, deviceScaleFactor: 2 }, 'tablet');
  console.log('Screenshots captured in store_assets/play_store/screenshots');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
