// Smoke-test every independently built Segaloka dashboard bundle.
const { chromium } = require('playwright');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APPS = [
  { name: 'control-center', file: 'segaloka-control-center.html', home: '/overview', allow: p => !p.startsWith('/p/') },
  { name: 'travel', file: 'segaloka-travel.html', home: '/p/travel', allow: p => p.startsWith('/p/travel') },
  { name: 'vendor', file: 'segaloka-vendor.html', home: '/p/vendor', allow: p => p.startsWith('/p/vendor') },
  { name: 'traveler', file: 'segaloka-traveler.html', home: '/p/traveler', allow: p => p.startsWith('/p/traveler') },
  { name: 'affiliate', file: 'segaloka-affiliate.html', home: '/p/affiliate', allow: p => p.startsWith('/p/affiliate') },
  { name: 'mitra', file: 'segaloka-mitra.html', home: '/p/mitra', allow: p => p.startsWith('/p/mitra') },
  { name: 'agen', file: 'segaloka-agen.html', home: '/p/agen', allow: p => p.startsWith('/p/agen') }
];

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  for (const app of APPS) {
    const ctx = await browser.newContext({ viewport: { width: +(process.env.W || 1440), height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    const file = 'file://' + path.join(ROOT, app.file);
    await page.goto(file + (process.env.Q || '?demo') + '#' + app.home);
    await page.waitForTimeout(600);
    const state = await page.evaluate(() => ({
      root: !!document.getElementById('root'),
      work: !!document.getElementById('work'),
      text: (document.getElementById('work') || {}).innerText || '',
      routes: typeof ROUTES === 'undefined' ? [] : ROUTES.map(r => r.pattern),
      home: typeof APP === 'undefined' ? null : APP.home,
      actor: typeof APP === 'undefined' ? null : APP.actor
    }));
    if (!state.root || !state.work || state.text.length < 20) failures.push(app.name + ': dashboard did not render');
    if (state.home !== app.home) failures.push(app.name + ': APP.home=' + state.home + ', expected ' + app.home);
    const foreign = state.routes.filter(p => p.startsWith('/p/') && !app.allow(p));
    if (foreign.length) failures.push(app.name + ': foreign portal routes: ' + foreign.join(', '));
    if (errors.length) failures.push(app.name + ': JS errors: ' + [...new Set(errors)].join(' | '));
    console.log(app.name, 'actor=' + state.actor, 'routes=' + state.routes.length, 'foreign=' + foreign.length, 'errors=' + errors.length);
    await ctx.close();
  }
  await browser.close();
  if (failures.length) {
    console.error('BUNDLE SMOKE FAILURES', failures.length);
    failures.forEach(x => console.error('  ' + x));
    process.exitCode = 1;
  } else {
    console.log('BUNDLE SMOKE OK', APPS.length + '/7');
  }
})();
