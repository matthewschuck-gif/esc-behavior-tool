// One-time split: the Vercel site (public/index.html + public/app.js) → Apps Script HTML files
// in apps-script/. public/ is left exactly as it is, so the Vercel site keeps working until the
// switch. After this runs, apps-script/*.html are the source of truth for the Apps Script site.
//
//   node tools/split-for-apps-script.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'apps-script');
const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
let app = fs.readFileSync(path.join(root, 'public', 'app.js'), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');

const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>', styleStart) + '</style>'.length;
const appTag = '<script src="/app.js"></script>';
if (styleStart < 0 || html.indexOf(appTag) < 0) throw new Error('page layout changed; check the markers');

const index = html.slice(0, styleStart) + "<?!= include('Styles'); ?>" + html.slice(styleEnd)
  .replace(appTag, "<?!= include('Bridge'); ?>\n<?!= include('App'); ?>");

// The password gate: passwords are checked on the server now (see Bridge.html / Code.gs).
const gateStart = app.indexOf("var SITE_PASSWORD = '");
const gateEnd = app.indexOf('function initAuth()');
if (gateStart < 0 || gateEnd < 0) throw new Error('password gate not found');
app = app.slice(0, gateStart) +
`// Passwords are checked on the server (Code.gs bicSignIn); none are in this page any more.
// In EASD mode staff are signed in with Google and this gate never shows (Bridge.html).
var isAdminMode = false;
var isTrialMode = false;

function checkPassword() {
  try {
    var val = document.getElementById('pwInput').value;
    var err = document.getElementById('pwError');
    window.bicSignIn_(val).then(function (role) {
      document.getElementById('pwGate').style.display = 'none';
      if (role === 'admin') { isAdminMode = true; try { enableAdminMode(); } catch(e) {} }
      if (role === 'trial') { isTrialMode = true; try { enableTrialMode(); } catch(e) {} }
      if (role === 'user') { try { setTimeout(maybeShowTour, 800); } catch(e) {} }
    }).catch(function () {
      if (err) err.style.display = 'block';
      document.getElementById('pwInput').value = '';
    });
  } catch(e) { console.error('checkPassword error:', e); }
}

` + app.slice(gateEnd);

fs.writeFileSync(path.join(out, 'Index.html'), index);
fs.writeFileSync(path.join(out, 'Styles.html'), html.slice(styleStart, styleEnd) + '\n');
fs.writeFileSync(path.join(out, 'App.html'), '<script>\n' + app + '\n</script>\n');
for (const f of ['Index', 'Styles', 'App']) console.log(f + '.html', fs.statSync(path.join(out, f + '.html')).size, 'bytes');
