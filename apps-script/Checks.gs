/**
 * Plan check-ins, "what works here" and the MTSS one-pager.
 *
 * CHECK-INS (CHECKINS ON): every saved plan with a student 800# (or any active plan) gets a check
 * CHECKIN_DAYS after it was saved (14, then 28): "Is the plan working? Better / Same / Worse", and
 * "How often did you use it? Every day / Most days / Not much". Teachers answer from an email with
 * one-tap buttons (CHECKIN_EMAIL ON; the daily job bicDailyChecks sends them) or from the
 * "Check-ins" chip in BIC. Plan Checks tab: Check ID | Plan ID | Email | Student 800# | Bucket |
 * Strategies | Saved | Check | Due | Sent | Result | Used | Answered | Token.
 *
 * WHAT WORKS HERE: answered checks add up by behavior type (the plan's bucket) and strategy: a
 * strategy "worked" when the plan was Better. The Strategy Outcomes tab (Bucket | Strategy | Tried |
 * Worked | Rate | Updated) is rewritten daily for Follow-Up and Climb-er to read, and BIC shows it.
 * Small numbers are shown as they are: 1 of 1 is not proof, so the page says "tried N times".
 *
 * MTSS ONE-PAGER (?page=mtss&plan=ID, the plan's teacher or an admin): the plan, its strategies,
 * every check-in with how often it was used (fidelity), and incidents in the 4 weeks before the
 * plan vs. since it, from the Follow-Up incident Sheet (INCIDENT_SHEET_ID: any tab with an
 * "800 Number (Student ID)" or "800#" column and a Timestamp).
 *
 * No names anywhere: plans carry an 800# only, and the email to the teacher names the plan's
 * summary and the 800#'s last 3 digits.
 */

const CHECKS_TAB_ = 'Plan Checks';
const CHECK_HEADERS_ = ['Check ID', 'Plan ID', 'Email', 'Student 800#', 'Bucket', 'Strategies', 'Saved', 'Check', 'Due', 'Sent', 'Result', 'Used', 'Answered', 'Token'];
const OUTCOMES_TAB_ = 'Strategy Outcomes';
const OUTCOME_HEADERS_ = ['Bucket', 'Strategy', 'Tried', 'Worked', 'Rate', 'Updated'];
const CHECK_RESULTS_ = { better: 'Better', same: 'Same', worse: 'Worse' };
const CHECK_USED_ = { every: 'Every day', most: 'Most days', little: 'Not much' };

function checksOn_() { return String(getSetting_('CHECKINS') || 'ON').toUpperCase() !== 'OFF'; }
function checkDays_() { const d = splitList_(getSetting_('CHECKIN_DAYS') || '14, 28').map(Number).filter(function (n) { return n > 0; }); return d.length ? d : [14, 28]; }
function ymdOf_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const s = String(v || '').trim(), m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  const d = new Date(s);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}
function addDaysYmd_(ymd, n) { const d = new Date(ymd + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function todayYmd_() { return new Date().toISOString().slice(0, 10); }
function ckTab_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers || (name === OUTCOMES_TAB_ ? OUTCOME_HEADERS_ : CHECK_HEADERS_)); sh.setFrozenRows(1); }
  return sh;
}
function rowsOf_(name, headers) {
  const sh = ckTab_(name, headers), data = sh.getDataRange().getValues();
  if (!data.length) { sh.appendRow(headers); return []; }
  const h = data[0].map(function (x) { return String(x).trim(); });
  return data.slice(1).map(function (r, i) { const o = { _row: i + 2 }; h.forEach(function (k, j) { o[k] = r[j]; }); return o; });
}
function setCell_(name, row, header, value) {
  const sh = ckTab_(name), h = sh.getDataRange().getValues()[0].map(function (x) { return String(x).trim(); }), c = h.indexOf(header);
  if (c > -1) sh.getRange(row, c + 1).setValues([[value]]);
}

// After plans are saved: every active plan gets its check rows (once). Closed plans get no new checks.
function syncPlanChecks_() {
  if (!checksOn_()) return 0;
  const have = {}, days = checkDays_();
  rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).forEach(function (c) { have[String(c['Plan ID']) + '|' + String(c['Check'])] = true; });
  const sh = ckTab_(CHECKS_TAB_, CHECK_HEADERS_);
  let added = 0;
  tab_(PLANS_TAB_).getDataRange().getValues().slice(1).forEach(function (r) {
    let p = null; try { p = JSON.parse(String(r[7])); } catch (e) { p = null; }
    if (!p || !p.id || String(p.status || 'active') === 'closed') return;
    const saved = ymdOf_(p.savedAt || r[3]);
    if (!saved) return;
    days.forEach(function (d, i) {
      if (have[p.id + '|' + (i + 1)]) return;
      sh.appendRow(['c' + Utilities.getUuid().replace(/-/g, '').slice(0, 10), p.id, String(r[0]).toLowerCase(), String(r[1] || ''), String(p.bucket || ''),
        (p.strategies || []).join(' | '), saved, i + 1, addDaysYmd_(saved, d), '', '', '', '', Utilities.getUuid().replace(/-/g, '')]);
      added++;
    });
  });
  return added;
}

// Records an answer (from the email link or the page). result: better/same/worse; used: every/most/little.
function answerCheck_(c, result, used) {
  const r = CHECK_RESULTS_[String(result || '').toLowerCase()], u = CHECK_USED_[String(used || '').toLowerCase()];
  if (!r && !u) throw new Error('Pick how it is going.');
  if (r) setCell_(CHECKS_TAB_, c._row, 'Result', r);
  if (u) setCell_(CHECKS_TAB_, c._row, 'Used', u);
  setCell_(CHECKS_TAB_, c._row, 'Answered', todayYmd_());
  writeOutcomes_();
}

/** The page: this teacher's check-ins that are due and not answered yet, plus their plans for the one-pager. */
function bicMyChecks(token) {
  const who = caller_(token);
  if (!who.email || !checksOn_()) return JSON.stringify({ on: false });
  syncPlanChecks_();
  const t = todayYmd_();
  const due = rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).filter(function (c) { return String(c['Email']).toLowerCase() === who.email && !String(c['Result'] || '').trim() && ymdOf_(c['Due']) <= t; })
    .map(function (c) { return { id: String(c['Check ID']), plan: String(c['Plan ID']), student: String(c['Student 800#'] || '').slice(-3), check: Number(c['Check']), strategies: String(c['Strategies'] || ''), saved: ymdOf_(c['Saved']) }; });
  return JSON.stringify({ on: true, due: due, works: whatWorks_() });
}
function bicAnswerCheck(token, id, result, used) {
  const who = caller_(token);
  const c = rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).filter(function (x) { return String(x['Check ID']) === String(id); })[0];
  if (!c || (String(c['Email']).toLowerCase() !== who.email && who.role !== 'admin')) throw new Error('That check-in is not yours.');
  answerCheck_(c, result, used);
  return JSON.stringify({ ok: true });
}

// The email link: ?checkin=TOKEN&r=better (&u=most). Returns a small page (no sign-in needed: the token is the key).
function checkinPage_(e) {
  const p = e.parameter, c = rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).filter(function (x) { return String(x['Token']) && String(x['Token']) === String(p.checkin); })[0];
  let body;
  if (!c) body = '<h2>That check-in link has run out.</h2><p>Open BIC and use the Check-ins button.</p>';
  else {
    try { answerCheck_(c, p.r, p.u); } catch (err) { /* only the fidelity question may be left */ }
    const link = function (u, label) { return '<a class="b" href="' + checkLink_(c, p.r, u) + '" target="_top">' + label + '</a>'; };
    body = '<h2>Thank you!</h2><p>Saved: the plan is <b>' + (CHECK_RESULTS_[String(p.r || '').toLowerCase()] || String(c['Result'] || '—')) + '</b>.</p>' +
      (p.u ? '<p>And you used it: <b>' + CHECK_USED_[String(p.u).toLowerCase()] + '</b>. That helps the whole building learn what works.</p>' :
        '<p>One more tap: how often did you use the plan?</p><p>' + link('every', 'Every day') + link('most', 'Most days') + link('little', 'Not much') + '</p>');
  }
  return HtmlService.createHtmlOutput('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px/1.5 system-ui,sans-serif;color:#1f1235;max-width:520px;margin:40px auto;padding:0 18px}h2{color:#3b0764}.b{display:inline-block;margin:4px 6px 4px 0;padding:10px 16px;border-radius:999px;background:#3b0764;color:#fff;text-decoration:none;font-weight:700}</style>' + body)
    .setTitle('Plan check-in · BIC').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function bicLink_() { return String(getSetting_('BIC_LINK') || 'https://behaviorinterventioncenter.com').replace(/\/+$/, ''); }
function checkLink_(c, r, u) { return bicLink_() + '/?checkin=' + encodeURIComponent(String(c['Token'])) + (r ? '&r=' + r : '') + (u ? '&u=' + u : ''); }

/** Daily (trigger made by Set up check-ins): emails each due, unsent check-in once; rewrites Strategy Outcomes. */
function bicDailyChecks() {
  syncPlanChecks_();
  let sent = 0;
  if (String(getSetting_('CHECKIN_EMAIL') || 'ON').toUpperCase() !== 'OFF') {
    const t = todayYmd_(), plans = {};
    tab_(PLANS_TAB_).getDataRange().getValues().slice(1).forEach(function (r) { plans[String(r[2])] = String(r[6] || ''); });
    rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).forEach(function (c) {
      if (String(c['Sent'] || '').trim() || String(c['Result'] || '').trim() || ymdOf_(c['Due']) > t || !/@/.test(String(c['Email']))) return;
      const b = function (r, label, color) { return '<a href="' + checkLink_(c, r) + '" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:999px;background:' + color + ';color:#fff;text-decoration:none;font-weight:700">' + label + '</a>'; };
      const who = String(c['Student 800#'] || '') ? 'the student ending in ' + String(c['Student 800#']).slice(-3) : 'your student';
      try {
        MailApp.sendEmail({ to: String(c['Email']), subject: 'Quick check: is the behavior plan working?',
          htmlBody: '<div style="font:14px Arial,sans-serif;color:#222"><p>' + (Number(c['Check']) === 1 ? 'Two weeks ago' : 'A while ago') + ' you made a behavior plan in BIC for ' + who + (plans[String(c['Plan ID'])] ? ':<br><i>' + escHtml_(plans[String(c['Plan ID'])].slice(0, 200)) + '</i>' : '.') + '</p>' +
            '<p><b>Is it working?</b> One tap:</p><p>' + b('better', 'Better', '#16a34a') + b('same', 'About the same', '#6b7280') + b('worse', 'Worse', '#b45309') + '</p>' +
            '<p style="color:#666;font-size:12px">Your answers stay with your plan and help BIC show which strategies work in our building. Strategies tried: ' + escHtml_(String(c['Strategies'] || '—')) + '</p></div>' });
        setCell_(CHECKS_TAB_, c._row, 'Sent', t); sent++;
      } catch (err) { console.warn('Check-in email: ' + err.message); }
    });
  }
  writeOutcomes_();
  return sent;
}
function escHtml_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

// { bucket: [{ strategy, tried, worked }] } from answered checks (each plan counts once: its latest answer).
function whatWorks_() {
  const latest = {};
  rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).forEach(function (c) {
    if (!String(c['Result'] || '').trim()) return;
    const k = String(c['Plan ID']);
    if (!latest[k] || Number(c['Check']) > Number(latest[k]['Check'])) latest[k] = c;
  });
  const out = {};
  Object.keys(latest).forEach(function (k) {
    const c = latest[k], bucket = String(c['Bucket'] || 'Any').trim() || 'Any', ok = String(c['Result']) === 'Better';
    String(c['Strategies'] || '').split('|').map(function (s) { return s.trim(); }).filter(String).forEach(function (s) {
      out[bucket] = out[bucket] || {};
      const o = out[bucket][s] = out[bucket][s] || { strategy: s, tried: 0, worked: 0 };
      o.tried++; if (ok) o.worked++;
    });
  });
  const res = {};
  Object.keys(out).forEach(function (b) { res[b] = Object.keys(out[b]).map(function (s) { return out[b][s]; }).sort(function (x, y) { return (y.worked / y.tried) - (x.worked / x.tried) || y.tried - x.tried; }); });
  return res;
}
function writeOutcomes_() {
  const w = whatWorks_(), rows = [], t = todayYmd_();
  Object.keys(w).forEach(function (b) { w[b].forEach(function (o) { rows.push([b, o.strategy, o.tried, o.worked, Math.round(100 * o.worked / o.tried) + '%', t]); }); });
  const sh = ckTab_(OUTCOMES_TAB_, OUTCOME_HEADERS_);
  const n = sh.getDataRange().getValues().length;
  for (let i = n; i >= 2; i--) sh.deleteRow(i);
  if (!n) sh.appendRow(OUTCOME_HEADERS_);
  rows.forEach(function (r) { sh.appendRow(r); });
  return rows.length;
}

// ── MTSS ONE-PAGER ──────────────────────────────────────────────────
// Incidents for one 800# by date, from the Follow-Up incident Sheet (INCIDENT_SHEET_ID).
function incidentDates_(id) {
  const sheetId = String(getSetting_('INCIDENT_SHEET_ID') || '').trim();
  if (!sheetId || !id) return null;
  const out = [];
  SpreadsheetApp.openById(sheetId).getSheets().forEach(function (sh) {
    const v = sh.getDataRange().getValues();
    if (v.length < 2) return;
    const h = v[0].map(function (x) { return String(x).trim(); });
    const ic = h.indexOf('800 Number (Student ID)') > -1 ? h.indexOf('800 Number (Student ID)') : h.indexOf('800#') > -1 ? h.indexOf('800#') : h.indexOf('Student 800#');
    const dc = h.indexOf('Timestamp') > -1 ? h.indexOf('Timestamp') : h.indexOf('Submission Timestamp');
    if (ic === -1 || dc === -1 || /follow/i.test(sh.getName())) return; // the Follow-Ups tab repeats incidents
    v.slice(1).forEach(function (r) { if (String(r[ic]).replace(/\D/g, '') === id) { const d = ymdOf_(r[dc]); if (d) out.push(d); } });
  });
  return out.sort();
}
function mtssPage_(e) {
  const who = caller_(''), planId = String(e.parameter.plan || '');
  const row = tab_(PLANS_TAB_).getDataRange().getValues().slice(1).filter(function (r) { return String(r[2]) === planId; })[0];
  if (!row || (String(row[0]).toLowerCase() !== who.email && who.role !== 'admin')) return HtmlService.createHtmlOutput('<p style="font:16px system-ui;margin:40px">That plan is not yours, or it was not found.</p>');
  let p = {}; try { p = JSON.parse(String(row[7])); } catch (err) { p = {}; }
  const id = String(row[1] || ''), saved = ymdOf_(p.savedAt || row[3]), t = todayYmd_();
  const checks = rowsOf_(CHECKS_TAB_, CHECK_HEADERS_).filter(function (c) { return String(c['Plan ID']) === planId; }).sort(function (a, b) { return Number(a['Check']) - Number(b['Check']); });
  const inc = incidentDates_(id);
  const before = inc ? inc.filter(function (d) { return d >= addDaysYmd_(saved, -28) && d < saved; }).length : null;
  const sinceDays = Math.max(1, Math.round((new Date(t + 'T12:00:00Z') - new Date(saved + 'T12:00:00Z')) / 86400000));
  const since = inc ? inc.filter(function (d) { return d >= saved; }).length : null;
  const per4 = function (n, days) { return Math.round(n / days * 28 * 10) / 10; };
  const fp = p.fullPlan || {};
  const li = function (a) { return (a || []).map(function (s) { return '<li><b>' + escHtml_(s.name || s) + '</b>' + (s.how || s.why ? ': ' + escHtml_(s.how || s.why) : '') + '</li>'; }).join(''); };
  const html = '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>MTSS one-pager</title>' +
    '<style>body{font:13.5px/1.45 Arial,sans-serif;color:#1c1530;max-width:760px;margin:24px auto;padding:0 20px}h1{font-size:20px;margin:0 0 2px;color:#3b0764}h2{font-size:14px;margin:16px 0 4px;color:#3b0764;border-bottom:1px solid #ddd}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:4px 8px;text-align:left}.n{font-size:22px;font-weight:700}.muted{color:#666}@media print{button{display:none}}</style>' +
    '<button onclick="window.print()" style="float:right">Print / Save as PDF</button><h1>Behavior plan: MTSS one-pager</h1>' +
    '<div class="muted">Student 800# ' + escHtml_(id || '—') + ' · plan saved ' + escHtml_(saved) + ' by ' + escHtml_(String(row[0])) + ' · priority ' + escHtml_(String(p.priority || '—')) + ' · status ' + escHtml_(String(p.status || 'active')) + '</div>' +
    '<h2>What we see</h2><p>' + escHtml_(String(p.summary || '—')) + '</p>' +
    (p.bucket ? '<p class="muted">Behavior type: ' + escHtml_(String(p.bucket)) + (p.trauma ? ' · ' + escHtml_(String(p.trauma)) : '') + '</p>' : '') +
    '<h2>Strategies</h2><ul>' + (li(fp.try_first) || li(p.strategies)) + '</ul>' +
    '<h2>Check-ins (is it working, and how often it was used)</h2>' + (checks.length ? '<table><tr><th>Check</th><th>Due</th><th>Is it working?</th><th>Used</th><th>Answered</th></tr>' + checks.map(function (c) { return '<tr><td>' + c['Check'] + '</td><td>' + escHtml_(ymdOf_(c['Due'])) + '</td><td>' + escHtml_(String(c['Result'] || '—')) + '</td><td>' + escHtml_(String(c['Used'] || '—')) + '</td><td>' + escHtml_(ymdOf_(c['Answered']) || '—') + '</td></tr>'; }).join('') + '</table>' : '<p class="muted">No check-ins yet.</p>') +
    '<h2>Incidents before and after the plan</h2>' + (inc ? '<table><tr><th>4 weeks before</th><th>Since the plan (' + sinceDays + ' days)</th><th>Per 4 weeks since</th></tr><tr><td class="n">' + before + '</td><td class="n">' + since + '</td><td class="n">' + per4(since, sinceDays) + '</td></tr></table>' : '<p class="muted">Set INCIDENT_SHEET_ID in Settings (the Follow-Up incident Sheet) to see incidents here.</p>') +
    (p.progress && p.progress.length ? '<h2>Progress notes</h2><ul>' + p.progress.map(function (n) { return '<li>' + escHtml_(n.date) + ': ' + escHtml_(n.note) + '</li>'; }).join('') + '</ul>' : '') +
    '<p class="muted" style="margin-top:18px">Made by the Behavior Intervention Center. No student names are stored in BIC.</p>';
  return HtmlService.createHtmlOutput(html).setTitle('MTSS one-pager · BIC').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function menuSetupChecks_() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'bicDailyChecks') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('bicDailyChecks').timeBased().everyDays(1).atHour(7).create();
  ckTab_(CHECKS_TAB_, CHECK_HEADERS_); ckTab_(OUTCOMES_TAB_, OUTCOME_HEADERS_);
  const n = syncPlanChecks_();
  SpreadsheetApp.getUi().alert('Check-ins are on: every morning at 7, BIC emails teachers whose plan check-in is due. ' + n + ' check-ins were added for saved plans.');
}
