// Local preview of the Apps Script version: renders Index.html with its includes and runs the
// real .gs code in the browser against fake Google services (EASD mode, signed in as the owner,
// so Edit mode shows; add ?as=teacher to be a regular teacher, ?id=8001234 for a student link).
// AI answers are canned. node tests/build-preview.js → http://localhost:3042
const fs = require('fs');
const path = require('path');
const http = require('http');
const dir = path.join(__dirname, '..', 'apps-script');
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');

function build(query) {
  const as = /as=teacher/.test(query) ? 'teacher@easdpa.org' : 'owner@easdpa.org';
  const id = (query.match(/id=(\d+)/) || [])[1] || '';
  const gs = fs.readdirSync(dir).filter(f => f.endsWith('.gs')).sort().map(read).join('\n');
  const fake = `<script>
(function () {
  function makeSheet(name) { var s = { rows: [], getName: function () { return name; }, getLastRow: function () { return this.rows.length; },
    getDataRange: function () { var t = this; return { getValues: function () { return t.rows.map(function (r) { return r.slice(); }); } }; },
    getRange: function (r, c, nr, nc) { var t = this, p; var api = { setValues: function (v) { v.forEach(function (row, i) { t.rows[r - 1 + i] = t.rows[r - 1 + i] || []; row.forEach(function (x, j) { t.rows[r - 1 + i][c - 1 + j] = x; }); }); return p; }, offset: function () { return p; } };
      p = new Proxy(api, { get: function (o, k) { return k in o ? o[k] : function () { return p; }; } }); return p; },
    appendRow: function (row) { this.rows.push(row.slice()); }, deleteRow: function (n) { this.rows.splice(n - 1, 1); }, setFrozenRows: function () {} }; return s; }
  var sheets = [], props = { ANTHROPIC_API_KEY: 'sk-ant-preview' }, cache = {};
  var book = { getSheetByName: function (n) { return sheets.filter(function (s) { return s.getName() === n; })[0] || null; }, insertSheet: function (n) { var s = makeSheet(n); sheets.push(s); return s; }, getId: function () { return 'BIC'; } };
  window.__sheets = sheets;
  window.SpreadsheetApp = { getActiveSpreadsheet: function () { return book; } };
  window.Session = { getActiveUser: function () { return { getEmail: function () { return '${as}'; } }; }, getEffectiveUser: function () { return { getEmail: function () { return 'owner@easdpa.org'; } }; }, getScriptTimeZone: function () { return 'America/New_York'; } };
  window.PropertiesService = { getScriptProperties: function () { return { getProperty: function (k) { return props[k] || null; }, setProperty: function (k, v) { props[k] = v; } }; } };
  window.CacheService = { getScriptCache: function () { return { get: function (k) { return cache[k] || null; }, put: function (k, v) { cache[k] = v; } }; } };
  window.LockService = { getScriptLock: function () { return { waitLock: function () {}, releaseLock: function () {} }; } };
  window.Utilities = { getUuid: function () { return 'u' + Math.random().toString(36).slice(2); }, computeDigest: function (a, s) { return s.split('').map(function (c) { return c.charCodeAt(0) % 128; }); },
    DigestAlgorithm: {}, Charset: {}, formatDate: function () { return '20261031'; }, base64EncodeWebSafe: function (s) { return btoa(s); },
    base64Decode: function (s) { return Array.from(atob(s)).map(function (c) { return c.charCodeAt(0); }); }, newBlob: function (b, m, n) { return { b: b, m: m, n: n }; } };
  window.UrlFetchApp = { fetch: function () { return { getResponseCode: function () { return 200; }, getContentText: function () {
    return JSON.stringify({ model: 'preview', usage: {}, content: [{ type: 'text', text: 'Preview coaching note: the pattern you described suggests the student needs connection before correction.' }] }); } }; } };
  var files = 0;
  window.DriveApp = { Access: {}, Permission: {}, getFileById: function () { return { getParents: function () { return { hasNext: function () { return false; } }; } }; },
    getRootFolder: function () { return { createFolder: function () { return { getId: function () { return 'F'; }, createFile: function () { files++; return { getId: function () { return 'IMG' + files; }, setSharing: function () {} }; } }; } }; },
    getFolderById: function () { return { createFile: function () { files++; return { getId: function () { return 'IMG' + files; }, setSharing: function () {} }; } }; } };
})();
</script>
<script>${gs.replace(/<\/script>/g, '<\\/script>')}
ensureSettings_(); ensureStoreTabs_();
</script>
<script>
window.google = { script: { get run() {
  var ok = function () {}, fail = function (e) { console.error(e); };
  var runner = new Proxy({}, { get: function (t, name) {
    if (name === 'withSuccessHandler') return function (f) { ok = f; return runner; };
    if (name === 'withFailureHandler') return function (f) { fail = f; return runner; };
    return function () { var args = arguments; setTimeout(function () { try { ok(window[name].apply(null, args)); } catch (e) { fail(e); } }, 30); };
  } });
  return runner;
} } };
</script>`;
  const boot = (() => {
    // Same as doGet: bootInfo_ plus ?id=, evaluated in the page.
    return `(function(){ var b = bootInfo_(); ${id ? `b.student = '${id}';` : ''} return b; })()`;
  })();
  let html = read('Index.html')
    .replace(/<\?!= include\('([A-Za-z]+)'\); \?>/g, (m, f) => read(f + '.html'))
    .replace('<?!= boot ?>', boot);
  return html.replace('<head>', '<head>\n' + fake);
}

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(build(req.url));
}).listen(3042, () => console.log('Preview on http://localhost:3042'));
