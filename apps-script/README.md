# Behavior Intervention Center: Apps Script version

This replaced the Vercel site on 2026-11-06. behaviorinterventioncenter.com (Vercel, `main`) now
serves only `public/index.html`, a page that shows this web app full-screen. `api/overrides-get.js`
is kept, read-only, so **BIC › Copy content from the old site** still works; delete it once the
content copy is confirmed.

**What moves where:**

| Before (Vercel) | Now (Apps Script) |
|---|---|
| Site, admin and trial passwords in the page code | **EASD mode:** staff sign in with their school Google account. **OPEN mode:** passwords are checked on the server and stored as hashes. |
| `/api/chat`, with the Claude key in Vercel, open to anyone | `AI.gs`. The key is in Script Properties. Signed-in people only, with a daily limit and an **AI Usage** log. |
| Vercel KV (`/api/overrides-*`), writable by anyone | **Content** tab. Admins edit content. Anyone signed in can leave feedback and plan logs. |
| Vercel Blob images | A Drive folder (`IMAGE_FOLDER_ID`) |
| Saved plans only in one browser | **Saved Plans** tab, per teacher. The plan carries the student's 800# when opened from Climb-er or Follow-Up. |

**Files:**
- `Code.gs`: page, sign-in, settings, menu.
- `Store.gs`: content, plans, images, copy from the old site.
- `AI.gs`
- `Index.html`, `Styles.html`, `App.html`: the original page and `app.js`. Only the password gate
  changed.
- `Bridge.html`: connects the page to Apps Script.

`tools/split-for-apps-script.js` made the HTML files from `public/`.

**Connections:**
- Climb-er and Follow-Up have a **🧭 Make a behavior plan** button that opens BIC with `?id=800#`.
- Climb-er's **BIC behavior plans** Sources row reads the Saved Plans tab.
- The 800# is stored with the plan only. The AI never receives it.

**Tests:**
```bash
node tests/bic.test.js
```
```bash
node tests/build-preview.js
```
The second serves a preview at http://localhost:3042. Add `?as=teacher` to see a regular teacher's
view, or `?id=8001234` for a student link.
