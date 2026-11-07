// Offline checks for the Behavior Intervention Center Apps Script version.
//   node tests/bic.test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const dir = path.join(__dirname, '..', 'apps-script');
let passed = 0;
function test(name, fn) { fn(); passed++; console.log('ok - ' + name); }
const J = x => JSON.parse(JSON.stringify(x)); // values from the sandbox → plain data

function makeSheet(name, rows) {
  const s = {
    rows: rows || [], getName: () => name,
    getLastRow() { return this.rows.length; },
    getDataRange() { const t = this; return { getValues: () => t.rows.map(r => r.slice()) }; },
    getRange(r, c, nr, nc) {
      const t = this; nr = nr || 1; nc = nc || 1; let p;
      const api = {
        setValues(v) { v.forEach((row, i) => { t.rows[r - 1 + i] = t.rows[r - 1 + i] || []; row.forEach((x, j) => { t.rows[r - 1 + i][c - 1 + j] = x; }); }); return p; },
        offset() { return p; },
      };
      p = new Proxy(api, { get: (o, k) => k in o ? o[k] : () => p });
      return p;
    },
    appendRow(row) { this.rows.push(row.slice()); },
    deleteRow(n) { this.rows.splice(n - 1, 1); },
    setFrozenRows() {},
  };
  return s;
}

function world(opts) {
  opts = opts || {};
  const sheets = [];
  const book = { getSheetByName: n => sheets.find(s => s.getName() === n) || null, insertSheet(n) { const s = makeSheet(n); sheets.push(s); return s; }, getId: () => 'BIC' };
  let user = opts.user === undefined ? 'teacher@easdpa.org' : opts.user;
  const props = {}, cache = {}, fetched = [], drive = [];
  let nextReply = null;
  const ctx = {
    console, JSON, Math, Date, Object, Array, String, Number,
    SpreadsheetApp: { getActiveSpreadsheet: () => book, getUi: () => ({ alert() {} }) },
    Session: { getActiveUser: () => ({ getEmail: () => user }), getEffectiveUser: () => ({ getEmail: () => 'owner@easdpa.org' }), getScriptTimeZone: () => 'America/New_York' },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: {
      getUuid: (() => { let n = 0; return () => 'uuid-' + (++n); })(),
      computeDigest: (a, s) => Array.from(require('crypto').createHash('sha256').update(s).digest()).map(b => b > 127 ? b - 256 : b),
      DigestAlgorithm: {}, Charset: {}, formatDate: () => '20261031',
      base64EncodeWebSafe: s => Buffer.from(s).toString('base64'), base64Decode: s => Array.from(Buffer.from(s, 'base64')),
      newBlob: (bytes, mime, name) => ({ bytes, mime, name }),
    },
    UrlFetchApp: {
      fetch(url, o) {
        fetched.push({ url, body: o && o.payload ? JSON.parse(o.payload) : null });
        if (/anthropic/.test(url)) return { getResponseCode: () => 200, getContentText: () => JSON.stringify(nextReply || { model: 'claude-sonnet-5-5', stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 20 }, content: [{ type: 'text', text: 'Coaching note' }] }) };
        if (/overrides-get\?key=strategy_overrides/.test(url)) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ overrides: { s1: { _imgUrl: 'https://abc.public.blob.vercel-storage.com/pic.png' }, _emotions: { e1: 'x' }, feedback_1: { rating: 5 } } }) };
        if (/overrides-get\?key=_emotions/.test(url)) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ overrides: { e0: 'old' } }) };
        if (/overrides-get/.test(url)) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ overrides: {} }) };
        if (/blob\.vercel-storage/.test(url)) return { getResponseCode: () => 200, getHeaders: () => ({ 'Content-Type': 'image/png' }), getContent: () => [1, 2, 3] };
        return { getResponseCode: () => 404, getContentText: () => '' };
      },
    },
    DriveApp: {
      Access: { ANYONE_WITH_LINK: 'a', DOMAIN_WITH_LINK: 'd' }, Permission: { VIEW: 'v' },
      getFileById: () => ({ getParents: () => ({ hasNext: () => false }) }),
      getRootFolder: () => ({ createFolder: () => ({ getId: () => 'FOLDER', createFile: b => { drive.push(b); return { getId: () => 'IMG' + drive.length, setSharing() {} }; } }) }),
      getFolderById: () => ({ createFile: b => { drive.push(b); return { getId: () => 'IMG' + drive.length, setSharing() {} }; } }),
    },
    HtmlService: {},
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readdirSync(dir).filter(f => f.endsWith('.gs')).sort().map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n'), ctx);
  ctx.ensureSettings_();
  ctx.ensureStoreTabs_();
  Object.assign(ctx, { book, props, fetched, drive, setUser: u => { user = u; }, reply: r => { nextReply = r; } });
  return ctx;
}
const setSetting = (w, k, v) => { const r = w.book.getSheetByName('Settings').rows.find(x => x[0] === k); r[1] = v; };
const api = (w, method, p, query, body, token) => JSON.parse(w.bicApi(token || '', method, p, query || {}, body ? JSON.stringify(body) : ''));

test('EASD mode: school accounts only, the owner and ADMIN_EMAILS are admins', () => {
  const w = world();
  assert.strictEqual(w.caller_('').role, 'user');
  w.setUser('someone@gmail.com');
  assert.throws(() => w.caller_(''), /school Google account/);
  w.setUser('owner@easdpa.org');
  assert.strictEqual(w.caller_('').role, 'admin');
  setSetting(w, 'ADMIN_EMAILS', 'Coach@easdpa.org');
  w.setUser('coach@easdpa.org');
  assert.strictEqual(w.caller_('').role, 'admin');
});

test('content: staff read edits; only admins change them; feedback and plan logs are open to write, admin-only to read', () => {
  const w = world({ user: 'owner@easdpa.org' });
  api(w, 'POST', 'overrides-set', {}, { key: 'strat_breathing', value: { name: 'Box breathing' } });
  api(w, 'POST', 'overrides-set', {}, { key: '_emotions', value: { calm: 'blue' } });
  w.setUser('teacher@easdpa.org');
  assert.throws(() => api(w, 'POST', 'overrides-set', {}, { key: 'strat_breathing', value: null }), /Only admins/);
  api(w, 'POST', 'overrides-set', {}, { key: 'feedback_1', value: { rating: 4, comment: 'Great' } });
  api(w, 'POST', 'overrides-set', {}, { key: 'plan_log_1', value: { bucket: 'connection' } });
  const all = api(w, 'GET', 'overrides-get', { key: 'strategy_overrides' }).overrides;
  assert.deepStrictEqual(Object.keys(all).sort(), ['_emotions', 'strat_breathing'], 'teachers do not get feedback or plan logs');
  assert.deepStrictEqual(api(w, 'GET', 'overrides-get', { key: '_emotions' }).overrides, { calm: 'blue' }, 'emotion edits come back (they were lost on reload before)');
  w.setUser('owner@easdpa.org');
  assert.ok(api(w, 'GET', 'overrides-get').overrides.feedback_1, 'admins see feedback');
  api(w, 'POST', 'overrides-set', {}, { key: 'strat_breathing', value: null });
  assert.strictEqual(api(w, 'GET', 'overrides-get').overrides.strat_breathing, undefined, 'null deletes');
});

test('long values are split across rows and come back whole', () => {
  const w = world({ user: 'owner@easdpa.org' });
  const big = { text: 'x'.repeat(100000) };
  api(w, 'POST', 'overrides-set', {}, { key: '_resources', value: big });
  assert.ok(w.book.getSheetByName('Content').rows.filter(r => r[0] === '_resources').length >= 3);
  assert.strictEqual(api(w, 'GET', 'overrides-get', { key: '_resources' }).overrides.text.length, 100000);
});

test('AI: key stays on the server, model and length come from Settings, daily cap, usage logged', () => {
  const w = world();
  assert.throws(() => api(w, 'POST', 'chat', {}, { messages: [{ role: 'user', content: 'hi' }] }), /No Claude key/);
  w.props.ANTHROPIC_API_KEY = 'sk-ant-test';
  const r = api(w, 'POST', 'chat', {}, { model: 'claude-opus-anything', max_tokens: 99999, messages: [{ role: 'user', content: 'hi' }] });
  assert.strictEqual(r.content[0].text, 'Coaching note');
  const sent = w.fetched.find(f => /anthropic/.test(f.url)).body;
  assert.strictEqual(sent.model, 'claude-sonnet-5-5', 'the page cannot pick the model');
  assert.strictEqual(sent.max_tokens, 6000);
  assert.deepStrictEqual(J(sent.output_config), { effort: 'low' });
  assert.deepStrictEqual(J(w.book.getSheetByName('AI Usage').rows[1].slice(1)), ['teacher@easdpa.org', 'claude-sonnet-5-5', 10, 20]);
  setSetting(w, 'AI_DAILY_LIMIT', '1');
  assert.throws(() => api(w, 'POST', 'chat', {}, { messages: [{ role: 'user', content: 'hi' }] }), /today's AI limit/);
  setSetting(w, 'AI', 'OFF');
  assert.throws(() => api(w, 'POST', 'chat', {}, { messages: [{ role: 'user', content: 'hi' }] }), /turned off/);
});

test('saved plans follow the teacher, carry the student 800# from a Climb-er link', () => {
  const w = world();
  w.bicSavePlans('', JSON.stringify([{ id: 'plan_1', savedAt: '2026-10-31', status: 'active', priority: 'High', summary: 'Needs connection', student: '800-1234' }]));
  const row = w.book.getSheetByName('Saved Plans').rows[1];
  assert.deepStrictEqual(J(row.slice(0, 3)), ['teacher@easdpa.org', '8001234', 'plan_1']);
  assert.strictEqual(JSON.parse(w.bicMyPlans(''))[0].summary, 'Needs connection');
  w.setUser('other@easdpa.org');
  assert.deepStrictEqual(J(JSON.parse(w.bicMyPlans(''))), [], 'another teacher sees none');
  w.bicSavePlans('', '[]');
  assert.strictEqual(w.book.getSheetByName('Saved Plans').rows.length, 2, 'saving their own empty list leaves others alone');
});

test('OPEN mode: passwords checked on the server and stored hashed; no plans saved centrally', () => {
  const w = world({ user: '' });
  setSetting(w, 'ACCESS', 'OPEN');
  assert.throws(() => w.caller_(''), /site password/);
  w.setPassword_('user', 'sitepw');
  w.setPassword_('admin', 'adminpw');
  assert.ok(!JSON.stringify(w.props).includes('sitepw'));
  assert.throws(() => w.bicSignIn('nope'), /Incorrect/);
  const u = JSON.parse(w.bicSignIn('sitepw'));
  assert.strictEqual(u.role, 'user');
  assert.strictEqual(w.caller_(u.token).role, 'user');
  assert.strictEqual(JSON.parse(w.bicSignIn('adminpw')).role, 'admin');
  assert.strictEqual(JSON.parse(w.bicMyPlans(u.token)), null);
});

test('image upload: admins only, saved to Drive', () => {
  const w = world();
  assert.throws(() => w.bicUploadImage('', 'a.png', 'image/png', 'AQID'), /Only admins/);
  w.setUser('owner@easdpa.org');
  assert.throws(() => w.bicUploadImage('', 'a.exe', 'application/x-msdownload', 'AQID'), /Only images/);
  assert.ok(/drive\.google\.com\/thumbnail\?id=IMG1/.test(JSON.parse(w.bicUploadImage('', 'a.png', 'image/png', 'AQID')).url));
});

test('copy from the old site: everything, newer nested copy wins, Vercel images moved to Drive', () => {
  const w = world({ user: 'owner@easdpa.org' });
  const r = w.importFromOldSite_();
  assert.strictEqual(r.images, 1);
  const all = api(w, 'GET', 'overrides-get').overrides;
  assert.ok(/drive\.google\.com/.test(all.s1._imgUrl));
  assert.deepStrictEqual(all._emotions, { e0: 'old', e1: 'x' });
  assert.ok(all.feedback_1);
});

test('page files: no passwords, the gate calls the server, scripts parse', () => {
  for (const f of ['App.html', 'Bridge.html', 'Index.html']) {
    const h = fs.readFileSync(path.join(dir, f), 'utf8');
    assert.ok(!/Thew26|Hope4|TrialCoach26|sk-ant-/.test(h), f);
    [...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].forEach(m => new vm.Script(m[1].replace(/<\?!=[\s\S]*?\?>/g, '{}')));
  }
  assert.ok(/bicSignIn_\(val\)/.test(fs.readFileSync(path.join(dir, 'App.html'), 'utf8')));
});

test('import unwraps the old site\'s { value: "<JSON>" } layers (they were copied as one "value" key)', () => {
  const w = world({ user: 'owner@easdpa.org' });
  let layered = JSON.stringify({ strat_breathing: { name: 'Box breathing' }, _emotions: { calm: 'blue' } });
  for (let i = 0; i < 6; i++) layered = JSON.stringify({ value: layered });
  assert.deepStrictEqual(Object.keys(w.unwrapOverrides_({ value: layered })).sort(), ['_emotions', 'strat_breathing']);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(w.unwrapOverrides_({ a: 1 }))), { a: 1 }, 'plain overrides pass through');
  assert.strictEqual(JSON.stringify(w.unwrapOverrides_(null)), '{}');
  assert.strictEqual(JSON.stringify(w.unwrapOverrides_({ value: 'not json' })), '{}');
});

test('the password box is hidden by the server for school accounts in EASD mode, shown otherwise', () => {
  const page = user => {
    const w = world({ user });
    let t = {};
    w.HtmlService.createTemplateFromFile = () => { t = { evaluate: () => { const o = { setTitle: () => o, addMetaTag: () => o, setXFrameOptionsMode: () => o }; return o; } }; return t; };
    w.HtmlService.XFrameOptionsMode = { ALLOWALL: 1 };
    w.doGet({ parameter: {} });
    return t.gateStyle;
  };
  assert.strictEqual(page('teacher@easdpa.org'), ' style="display:none"');
  assert.strictEqual(page('someone@gmail.com'), '', 'not a school account: the box stays (it says to use the school account)');
  assert.ok(/<div class="pw-gate" id="pwGate"<\?!= gateStyle \?>>/.test(fs.readFileSync(path.join(dir, 'Index.html'), 'utf8')));
});

// Apps Script fills in server tags only in the template (Index.html); include() pastes the other
// files raw. A tag in Bridge.html reached the live page as text: its script failed to parse.
function livePage(boot) {
  const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
  return read('Index.html')
    .replace('<?!= boot ?>', JSON.stringify(boot))
    .replace('<?!= gateStyle ?>', '')
    .replace(/<\?!= include\('([A-Za-z]+)'\); \?>/g, (m, f) => read(f + '.html'));
}

test('the page as Apps Script builds it: no server tags left, every script parses', () => {
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'Index.html')) {
    assert.ok(!/<\?/.test(fs.readFileSync(path.join(dir, f), 'utf8')), f + ' is included raw, so it cannot hold <? ?> tags');
  }
  const page = livePage({ mode: 'EASD', email: 't@easdpa.org', allowed: true });
  assert.ok(!/<\?/.test(page), 'a server tag was left in the page');
  const scripts = [...page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  scripts.forEach((s, i) => new vm.Script(s, { filename: 'script' + i }));
  assert.ok(scripts.some(s => /window\.BIC_BOOT = \{"mode":"EASD"/.test(s)), 'boot info comes before Bridge');
});

// Google strips comments from page scripts before serving them, and not carefully: live,
// value:'https://' lost everything after the // and App.html failed to parse. So every script
// must still parse after a crude stripper: // to end of line (unless it is a web address
// going on, like https://x), and /* ... */ anywhere, even inside strings.
function crudeStrip(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ''))
    .split('\n').map(l => l.replace(/(^|[^:\\])\/\/.*$|:\/\/(?=['"`\s]|$).*$/, (m, p) => (p || '') + (m.startsWith('://') ? ':' : ''))).join('\n');
}

test('scripts survive Google stripping comments (// at the end of a string, /* inside a string)', () => {
  const page = livePage({ mode: 'EASD', email: 't@easdpa.org', allowed: true });
  [...page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    try { new vm.Script(crudeStrip(m[1]), { filename: 'script' + i }); }
    catch (e) { const L = crudeStrip(m[1]).split('\n'); const n = Number((e.stack.match(/script\d+:(\d+)/) || [])[1]); throw new Error('script ' + i + ' line ' + n + ': ' + e.message + ' | ' + (L[n - 1] || '').trim().slice(0, 120)); }
  });
  assert.throws(() => new vm.Script(crudeStrip("var a = {v:'https://'};")), /Invalid or unexpected token/, 'the stripper reproduces the live failure');
});

test('Bridge runs when Chrome blocks storage in Google\'s frame, and saved plans still reach the Sheet', () => {
  const bridge = [...fs.readFileSync(path.join(dir, 'Bridge.html'), 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  const calls = [];
  const timers = [];
  function Storage() {}
  const win = {
    BIC_BOOT: { mode: 'EASD', email: 't@easdpa.org', allowed: true, student: '8001234' },
    fetch: () => {},
    setTimeout: (f) => { timers.push(f); }, clearTimeout() {},
    google: { script: { get run() {
      let ok = () => {};
      const r = new Proxy({}, { get: (t, n) => n === 'withSuccessHandler' ? f => { ok = f; return r; } : n === 'withFailureHandler' ? () => r : (...a) => { calls.push([n, ...a]); ok(n === 'bicMyPlans' ? [] : 'ok'); } });
      return r;
    } } },
  };
  Object.defineProperty(win, 'localStorage', { configurable: true, get() { throw new Error('SecurityError: Access is denied'); } });
  win.window = win;
  const ctx = vm.createContext(Object.assign(win, {
    Storage, Promise, JSON, Object, Array, String, Date, Error,
    document: { readyState: 'complete', getElementById: () => null, createElement: () => ({ appendChild() {} }), body: { appendChild() {} } },
  }));
  vm.runInContext(bridge, ctx);
  const ls = ctx.localStorage;
  ls.setItem('bic_dark', '1');
  assert.strictEqual(ls.getItem('bic_dark'), '1', 'a stand-in store is used for the visit');
  ls.setItem('bic_logs', JSON.stringify([{ id: 'p1', savedAt: new Date(Date.now() + 1000).toISOString() }]));
  timers.forEach(f => typeof f === 'function' && f());
  const saved = calls.find(c => c[0] === 'bicSavePlans');
  assert.ok(saved, 'plans are sent to the Sheet');
  assert.strictEqual(JSON.parse(saved[2])[0].student, '8001234', 'the student link still tags the plan');
});

console.log('\n' + passed + ' tests passed');
