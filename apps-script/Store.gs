/**
 * Storage, replacing Vercel KV and Vercel Blob.
 *
 * Content tab (Key | Part | Value | Updated | By): every content edit (strategy, resource,
 * emotion, step and header changes), feedback (feedback_…), anonymous plan logs (plan_log_…)
 * and _plan_index. Value is JSON; long values continue on extra rows (Part 1, 2, …) because a
 * cell holds at most 50,000 characters.
 * Who can write what: feedback_, plan_log_ and _plan_index = anyone signed in; everything
 * else = admins. Feedback and plan logs are only sent back to admins.
 *
 * Saved Plans tab: one row per saved plan per teacher (EASD mode only), so plans follow the
 * teacher to any device. No student names (the page tells staff to use initials). A plan made
 * from a "Make a behavior plan" button in Climb-er or Follow-Up carries the student's 800#
 * (Student 800# column) so Climb-er can show it on the student's page. The 800# is never sent
 * to the AI.
 *
 * Images go to a Drive folder (IMAGE_FOLDER_ID).
 */

const CONTENT_TAB_ = 'Content';
const CONTENT_HEADERS_ = ['Key', 'Part', 'Value', 'Updated', 'By'];
const PLANS_TAB_ = 'Saved Plans';
const PLANS_HEADERS_ = ['Email', 'Student 800#', 'Plan ID', 'Saved', 'Status', 'Priority', 'Summary', 'Plan JSON'];
const CELL_MAX_ = 45000;
const OPEN_KEYS_ = /^(feedback_|plan_log_|_plan_index$)/;
const PRIVATE_KEYS_ = /^(feedback_|plan_log_)/;

function ensureStoreTabs_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  [[CONTENT_TAB_, CONTENT_HEADERS_], [PLANS_TAB_, PLANS_HEADERS_], [AI_USAGE_TAB_, AI_USAGE_HEADERS_]].forEach(function (t) {
    let sh = ss.getSheetByName(t[0]);
    if (!sh) sh = ss.insertSheet(t[0]);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, t[1].length).setValues([t[1]]).setFontWeight('bold').setBackground('#3b0764').setFontColor('#ffffff');
      sh.setFrozenRows(1);
    }
  });
}

function tab_(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (sh) return sh;
  ensureStoreTabs_();
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// ── CONTENT STORE ───────────────────────────────────────────────────
function readStore_() {
  const sh = tab_(CONTENT_TAB_);
  const parts = {};
  sh.getDataRange().getValues().slice(1).forEach(function (r) {
    const k = String(r[0]).trim();
    if (!k) return;
    (parts[k] = parts[k] || []).push([Number(r[1]) || 0, String(r[2])]);
  });
  const out = {};
  Object.keys(parts).forEach(function (k) {
    const json = parts[k].sort(function (a, b) { return a[0] - b[0]; }).map(function (p) { return p[1]; }).join('');
    try { out[k] = JSON.parse(json); } catch (e) { out[k] = json; }
  });
  return out;
}

function writeStoreKey_(key, value, by) {
  const sh = tab_(CONTENT_TAB_);
  const data = sh.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) if (String(data[i][0]).trim() === key) sh.deleteRow(i + 1);
  if (value === null || value === undefined) return;
  const json = JSON.stringify(value);
  const stamp = new Date();
  const rows = [];
  for (let pos = 0, part = 0; pos < json.length || part === 0; pos += CELL_MAX_, part++) {
    rows.push([key, part, json.slice(pos, pos + CELL_MAX_), stamp, by || '']);
  }
  const range = sh.getRange(sh.getLastRow() + 1, 1, rows.length, CONTENT_HEADERS_.length);
  range.offset(0, 2, rows.length, 1).setNumberFormat('@'); // keep JSON as plain text
  range.setValues(rows);
}

// ── THE OLD /api/… CALLS (see Bridge.html) ──────────────────────────
// method 'GET' | 'POST', path like 'overrides-get', query { key }, body (parsed JSON).
function bicApi(token, method, path, query, bodyJson) {
  const who = caller_(token);
  const body = bodyJson ? JSON.parse(bodyJson) : {};
  query = query || {};
  if (path === 'overrides-get') {
    const store = readStore_();
    const key = query.key || 'strategy_overrides';
    if (key === 'strategy_overrides') {
      const all = {};
      Object.keys(store).forEach(function (k) { if (who.role === 'admin' || !PRIVATE_KEYS_.test(k)) all[k] = store[k]; });
      return JSON.stringify({ overrides: all });
    }
    if (PRIVATE_KEYS_.test(key) && who.role !== 'admin') return JSON.stringify({ overrides: {} });
    const v = store[key];
    return JSON.stringify({ overrides: v && typeof v === 'object' ? v : {} });
  }
  if (path === 'overrides-set') {
    const key = String(body.key || '');
    if (!key) throw new Error('key required');
    if (!OPEN_KEYS_.test(key) && who.role !== 'admin') throw new Error('Only admins can change this.');
    if (JSON.stringify(body.value || '').length > 400000) throw new Error('That is too big to save.');
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try { writeStoreKey_(key, body.value, who.email || who.role); } finally { lock.releaseLock(); }
    return JSON.stringify({ ok: true });
  }
  if (path === 'chat') return JSON.stringify(aiChat_(who, body));
  throw new Error('Unknown request: ' + path);
}

// ── IMAGES ──────────────────────────────────────────────────────────
function imageFolder_() {
  const id = getSetting_('IMAGE_FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  const props = PropertiesService.getScriptProperties();
  const made = props.getProperty('IMAGE_FOLDER_MADE');
  if (made) return DriveApp.getFolderById(made);
  const ssFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  const parents = ssFile.getParents();
  const folder = (parents.hasNext() ? parents.next() : DriveApp.getRootFolder()).createFolder('BIC Images');
  props.setProperty('IMAGE_FOLDER_MADE', folder.getId());
  return folder;
}

function saveImage_(name, mime, bytes) {
  const file = imageFolder_().createFile(Utilities.newBlob(bytes, mime || 'image/png', name || 'image.png'));
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); }
  catch (e) { file.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW); }
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w2000';
}

function bicUploadImage(token, name, mime, base64) {
  requireAdmin_(token);
  if (!/^image\//.test(String(mime))) throw new Error('Only images can be uploaded.');
  const bytes = Utilities.base64Decode(base64);
  if (bytes.length > 8 * 1024 * 1024) throw new Error('That image is over 8 MB.');
  return JSON.stringify({ url: saveImage_(String(name).replace(/[^\w.\-]/g, '_'), mime, bytes) });
}

// ── EACH TEACHER'S SAVED PLANS (EASD mode) ──────────────────────────
function bicMyPlans(token) {
  const who = caller_(token);
  if (!who.email) return JSON.stringify(null); // OPEN mode: plans stay in the browser
  const rows = tab_(PLANS_TAB_).getDataRange().getValues().slice(1)
    .filter(function (r) { return String(r[0]).toLowerCase() === who.email; });
  const plans = rows.map(function (r) { try { return JSON.parse(String(r[7])); } catch (e) { return null; } }).filter(Boolean);
  plans.sort(function (a, b) { return String(b.savedAt || '').localeCompare(String(a.savedAt || '')); });
  return JSON.stringify(plans);
}

function bicSavePlans(token, plansJson) {
  const who = caller_(token);
  if (!who.email) return JSON.stringify({ saved: false });
  const plans = JSON.parse(plansJson || '[]');
  if (!Array.isArray(plans)) throw new Error('Plans must be a list.');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = tab_(PLANS_TAB_);
    const data = sh.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) if (String(data[i][0]).toLowerCase() === who.email) sh.deleteRow(i + 1);
    const rows = plans.slice(0, 200).map(function (p) {
      const json = JSON.stringify(p);
      if (json.length > CELL_MAX_) throw new Error('One saved plan is too big to keep.');
      return [who.email, String(p.student || '').replace(/\D/g, ''), String(p.id || ''), String(p.savedAt || p.dateStr || ''), String(p.status || ''), String(p.priority || ''),
        String(p.summary || '').slice(0, 500), json];
    });
    if (rows.length) {
      const range = sh.getRange(sh.getLastRow() + 1, 1, rows.length, PLANS_HEADERS_.length);
      range.setNumberFormat('@');
      range.setValues(rows);
    }
    return JSON.stringify({ saved: true, count: rows.length });
  } finally {
    lock.releaseLock();
  }
}

// ── COPY FROM THE OLD SITE (one time, menu) ─────────────────────────
// Reads the old Vercel site's content and copies it into the Content tab. Images stored on
// Vercel are copied into the Drive folder and their links rewritten. Run it again any time
// before switching over: it replaces what it copied before.
function importFromOldSite_() {
  const base = String(getSetting_('OLD_SITE_URL') || '').replace(/\/+$/, '');
  if (!base) throw new Error('OLD_SITE_URL is blank on Settings.');
  const get = function (key) {
    const res = UrlFetchApp.fetch(base + '/api/overrides-get' + (key ? '?key=' + encodeURIComponent(key) : ''), { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return {};
    return (JSON.parse(res.getContentText()).overrides) || {};
  };
  const all = get('strategy_overrides');
  // Older versions also kept these as separate keys; the copy inside strategy_overrides is newer.
  ['_resources', '_emotions', '_steps', '_header', '_plan_index'].forEach(function (k) {
    const separate = get(k);
    if (Object.keys(separate).length) all[k] = Object.assign({}, separate, all[k] || {});
  });
  const images = {};
  const moveImages = function (v) {
    if (typeof v === 'string') {
      if (/^https:\/\/[^\s"]*blob\.vercel-storage\.com\//.test(v)) {
        if (!images[v]) {
          const r = UrlFetchApp.fetch(v, { muteHttpExceptions: true });
          images[v] = r.getResponseCode() === 200
            ? saveImage_(v.split('/').pop().split('?')[0], r.getHeaders()['Content-Type'] || 'image/png', r.getContent())
            : v;
        }
        return images[v];
      }
      return v;
    }
    if (Array.isArray(v)) return v.map(moveImages);
    if (v && typeof v === 'object') { const o = {}; Object.keys(v).forEach(function (k) { o[k] = moveImages(v[k]); }); return o; }
    return v;
  };
  let n = 0;
  Object.keys(all).forEach(function (k) { writeStoreKey_(k, moveImages(all[k]), 'copied from old site'); n++; });
  return { keys: n, images: Object.keys(images).length };
}

function menuImport_() {
  const ui = SpreadsheetApp.getUi();
  const ok = ui.alert('Copy content from the old site?', 'Reads ' + getSetting_('OLD_SITE_URL') + ' and copies its saved edits, feedback and plan logs into the Content tab (images go to Drive). The old site is not changed.', ui.ButtonSet.OK_CANCEL);
  if (ok !== ui.Button.OK) return;
  const r = importFromOldSite_();
  ui.alert('Copied ' + r.keys + ' items and ' + r.images + ' images.');
}
