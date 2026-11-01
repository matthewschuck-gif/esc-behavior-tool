/**
 * Behavior Intervention Center (BIC) -- Apps Script version.
 *
 * Replaces the Vercel site: the page is served here, the Claude key lives in Script
 * Properties, and content edits, feedback, plan logs and each teacher's saved plans live in
 * this Sheet. behaviorinterventioncenter.com can keep pointing at a tiny page that shows this
 * web app (see tools/wrapper-index.html).
 *
 * WHO CAN USE IT (Settings › ACCESS):
 *   EASD (default) -- deploy with "Who has access: Anyone within EASD". Staff are signed in
 *                     with Google, so there is no site password. Saved plans follow each
 *                     teacher (by email). Admins = ADMIN_EMAILS (and the sheet owner).
 *   OPEN           -- deploy with "Who has access: Anyone" to let outside educators in. A site
 *                     password (and optional trial password) is checked on the server; saved
 *                     plans stay in that browser. Set the passwords from the BIC menu.
 * Passwords are stored only as salted hashes in Script Properties.
 *
 * Files: Code (this), Store (content, feedback, plans, import), AI (Claude calls),
 * Index (page markup), Styles, App (the original app.js), Bridge (connects the page to the
 * functions here).
 */

const SETTINGS_TAB_ = 'Settings';
const DEFAULT_SETTINGS_ = [
  ['ACCESS', 'EASD', 'EASD = staff sign in with their school Google account (deploy: Anyone within EASD). OPEN = anyone with the site password (deploy: Anyone). After changing, also change "Who has access" in Deploy › Manage deployments.'],
  ['ALLOWED_DOMAINS', 'easdpa.org', 'In EASD mode, Google accounts from these domains can use the tool (comma separated).'],
  ['ADMIN_EMAILS', '', 'Who can edit strategies, resources, emotions, steps and the header, and read feedback (comma separated). The sheet owner is always an admin.'],
  ['AI', 'ON', 'ON = coaching notes and plans use Claude (key saved from the BIC menu). OFF = the steps and library still work, but no AI.'],
  ['CLAUDE_MODEL', 'claude-sonnet-5-5', 'Claude model for coaching notes and plans.'],
  ['AI_EFFORT', 'low', 'low / medium / high: how hard Claude thinks. low keeps answers under Apps Script\'s time limit; blank = the model default.'],
  ['AI_MAX_TOKENS', '6000', 'Longest answer Claude may write (plans need about 4000).'],
  ['AI_DAILY_LIMIT', '80', 'Most AI calls one person can make in a day (a full plan is about 8). Stops runaway use of the key.'],
  ['IMAGE_FOLDER_ID', '', 'Drive folder for uploaded images. Blank = a "BIC Images" folder is made next to this Sheet the first time.'],
  ['OLD_SITE_URL', 'https://behaviorinterventioncenter.com', 'The Vercel site to copy content from (BIC › Copy content from the old site).'],
  ['APP_TITLE', 'Behavior Intervention Center', 'Browser tab title.'],
];

// ── PAGE ────────────────────────────────────────────────────────────
function doGet(e) {
  const t = HtmlService.createTemplateFromFile('Index');
  const boot = bootInfo_();
  // ?id=800# (from Climb-er or Follow-Up): plans saved this visit are linked to that student.
  const id = String((e && e.parameter && e.parameter.id) || '').replace(/\D/g, '');
  if (id && boot.mode === 'EASD') boot.student = id;
  t.boot = JSON.stringify(boot);
  return t.evaluate()
    .setTitle(getSetting_('APP_TITLE') || 'Behavior Intervention Center')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // shown inside the .com page
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

// What the page needs to know before it starts.
function bootInfo_() {
  const mode = accessMode_();
  if (mode === 'OPEN') return { mode: mode, ai: aiOn_() };
  const me = currentEmail_();
  return { mode: mode, email: me, allowed: emailAllowed_(me), admin: isAdminEmail_(me), ai: aiOn_() };
}

// ── WHO IS THIS ─────────────────────────────────────────────────────
function accessMode_() { return String(getSetting_('ACCESS') || 'EASD').trim().toUpperCase() === 'OPEN' ? 'OPEN' : 'EASD'; }
function aiOn_() { return String(getSetting_('AI')).toUpperCase() !== 'OFF'; }

function currentEmail_() {
  try { return String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) { return ''; }
}

function emailAllowed_(email) {
  if (!email) return false;
  const domains = splitList_(getSetting_('ALLOWED_DOMAINS') || 'easdpa.org');
  return domains.some(function (d) { return email.slice(-(d.length + 1)) === '@' + d; });
}

function isAdminEmail_(email) {
  if (!email) return false;
  let owner = '';
  try { owner = String(Session.getEffectiveUser().getEmail() || '').toLowerCase(); } catch (e) { /* none */ }
  return email === owner || splitList_(getSetting_('ADMIN_EMAILS')).indexOf(email) > -1;
}

/**
 * The person making a call: { id, email, role: 'admin' | 'user' | 'trial' }, or throws.
 * EASD mode trusts the Google sign-in; OPEN mode needs the session from bicSignIn.
 */
function caller_(token) {
  if (accessMode_() === 'EASD') {
    const email = currentEmail_();
    if (!emailAllowed_(email)) throw new Error('Please sign in with your school Google account.');
    return { id: email, email: email, role: isAdminEmail_(email) ? 'admin' : 'user' };
  }
  const role = token ? CacheService.getScriptCache().get('bic-session-' + token) : null;
  if (!role) throw new Error('Please enter the site password again.');
  const email = currentEmail_();
  return { id: 'session:' + token, email: '', role: role === 'admin' || isAdminEmail_(email) ? 'admin' : role };
}

function requireAdmin_(token) {
  const who = caller_(token);
  if (who.role !== 'admin') throw new Error('Only admins can change this.');
  return who;
}

// OPEN mode: site, admin or trial password → a session (8 hours).
function bicSignIn(pw) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('bic-signin-fails')) || 0;
  if (fails >= 15) throw new Error('Too many tries. Wait 10 minutes.');
  const role = ['admin', 'user', 'trial'].filter(function (r) { return passwordMatches_(r, String(pw || '')); })[0];
  if (!role) {
    cache.put('bic-signin-fails', String(fails + 1), 600);
    throw new Error('Incorrect password.');
  }
  const token = Utilities.getUuid();
  cache.put('bic-session-' + token, role, 8 * 3600);
  return JSON.stringify({ token: token, role: role });
}

// EASD mode: an admin turns on edit mode (checked again on every save).
function bicWhoAmI(token) {
  const who = caller_(token);
  return JSON.stringify({ email: who.email, role: who.role });
}

// ── PASSWORDS (salted SHA-256 in Script Properties) ─────────────────
const PW_PROPS_ = { user: 'SITE_PW', admin: 'ADMIN_PW', trial: 'TRIAL_PW' };

function passwordMatches_(role, pw) {
  const props = PropertiesService.getScriptProperties();
  const hash = props.getProperty(PW_PROPS_[role] + '_HASH');
  return !!(pw && hash && hashPw_(pw, props.getProperty(PW_PROPS_[role] + '_SALT')) === hash);
}

function setPassword_(role, pw) {
  const salt = Utilities.getUuid();
  const props = PropertiesService.getScriptProperties();
  props.setProperty(PW_PROPS_[role] + '_SALT', salt);
  props.setProperty(PW_PROPS_[role] + '_HASH', hashPw_(pw, salt));
}

function hashPw_(pw, salt) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + pw, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}

// ── SETTINGS ────────────────────────────────────────────────────────
function ensureSettings_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SETTINGS_TAB_);
  if (!sheet) {
    sheet = ss.insertSheet(SETTINGS_TAB_);
    sheet.getRange(1, 1, 1, 3).setValues([['Key', 'Value', 'Notes']]).setFontWeight('bold').setBackground('#3b0764').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  const have = {};
  sheet.getDataRange().getValues().slice(1).forEach(function (r) { have[String(r[0]).trim()] = true; });
  const missing = DEFAULT_SETTINGS_.filter(function (d) { return !have[d[0]]; });
  if (missing.length) sheet.getRange(sheet.getLastRow() + 1, 1, missing.length, 3).setValues(missing);
}

function getSetting_(key) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_TAB_);
  if (sheet) {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]).trim() === key) return String(rows[i][1] == null ? '' : rows[i][1]).trim();
    }
  }
  const d = DEFAULT_SETTINGS_.filter(function (x) { return x[0] === key; })[0];
  return d ? d[1] : '';
}

function splitList_(v) {
  return String(v || '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(String);
}

// ── SHEET MENU ──────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi().createMenu('BIC')
    .addItem('Run setup (tabs + Settings)', 'setup')
    .addItem('Save Claude API key…', 'menuSaveKey_')
    .addItem('Copy content from the old site', 'menuImport_')
    .addSeparator()
    .addItem('Set site password (OPEN mode)…', 'menuSitePw_')
    .addItem('Set admin password (OPEN mode)…', 'menuAdminPw_')
    .addItem('Set trial password (OPEN mode)…', 'menuTrialPw_')
    .addToUi();
}

function setup() {
  ensureSettings_();
  ensureStoreTabs_();
  SpreadsheetApp.getUi().alert('BIC is set up: Settings, Content, Saved Plans and AI Usage tabs.\n\nNext: BIC › Save Claude API key…, then BIC › Copy content from the old site.');
}

function menuSaveKey_() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Claude API key', 'Paste the key (starts with sk-ant-). It is saved in Script Properties, never in the Sheet or the page.', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const key = r.getResponseText().trim();
  if (!/^sk-ant-/.test(key)) { ui.alert('That doesn\'t look like a Claude key (it should start with sk-ant-).'); return; }
  PropertiesService.getScriptProperties().setProperty('ANTHROPIC_API_KEY', key);
  ui.alert('Key saved.');
}

function menuPw_(role, label) {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Set the ' + label, 'At least 4 characters. Stored scrambled; nobody can read it back. Only used when ACCESS = OPEN.', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  if (r.getResponseText().length < 4) { ui.alert('Too short.'); return; }
  setPassword_(role, r.getResponseText());
  ui.alert(label.charAt(0).toUpperCase() + label.slice(1) + ' saved.');
}
function menuSitePw_() { menuPw_('user', 'site password'); }
function menuAdminPw_() { menuPw_('admin', 'admin password'); }
function menuTrialPw_() { menuPw_('trial', 'trial password'); }
