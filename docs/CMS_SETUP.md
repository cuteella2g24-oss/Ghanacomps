# Admin CMS — one-time Cloudflare setup

The site is now backed by a tiny Worker API + a Cloudflare **KV** store, so
admin edits (news, player teams, comp links, tweet embeds, fixture countdowns)
are saved **server-side and seen by every visitor** — not just in your own
browser like before.

You only have to do this setup **once**. After that, everything is edited from
the site itself with the 🔒 admin button.

---

## 1. Create the KV namespace

From the project folder, run:

```bash
npx wrangler kv namespace create CONTENT
```

It prints something like:

```
[[kv_namespaces]]
binding = "CONTENT"
id = "abcd1234ef567890abcd1234ef567890"
```

## 2. Paste the id into `wrangler.toml`

Open `wrangler.toml` and replace `REPLACE_WITH_KV_NAMESPACE_ID` with the `id`
from step 1:

```toml
[[kv_namespaces]]
binding = "CONTENT"
id = "abcd1234ef567890abcd1234ef567890"
```

Commit and push this change (the id is not a secret).

## 3. Set the admin password (write token)

This is the password you'll type into the site's admin lock. It is stored as a
Cloudflare **secret** — it never ships in the site's code.

```bash
npx wrangler secret put ADMIN_SECRET
```

Paste your chosen password when prompted. To change it later, run the same
command again.

## 4. Deploy

Deploy happens the usual way (git push → Cloudflare Workers Build), or manually:

```bash
npm run build
npx wrangler deploy
```

That's it. Visit the site, click the 🔒 button (bottom corner), enter the
`ADMIN_SECRET` password, edit anything, and press **Save Changes**. Changes go
live for everyone.

---

## How editing works now

| Where | What you can edit |
|-------|-------------------|
| Any page | Click the 🔒 lock, type the password → **edit mode**. Click any text to edit it. |
| **Home** | Latest News feed (add/remove headlines). |
| **Players** | Each player's **club/position** (click it in edit mode); **Transfers & Updates** news; Weekend Performers. |
| **Legends / Cult Heroes** | Every "Watch on X" **comp link is editable** — click the small **✎ link** button on a row to point it at a player's archive instead of one post. Add/remove legends. |
| **Legends → Essien** | **✎ Embed an X post** — paste a tweet URL and the post (with video) plays right on the page. Leave empty to show nothing. |
| **Black Stars** | **Goals & Moments** — paste X post URLs to embed goals that play on the site. **Fixture countdowns** — set each kickoff date/time. Matchday Highlights. |

Press **Save Changes** to publish. **Reset Page** discards unsaved changes and
reloads the last published version.

---

## Local development

- `npm run dev` (Vite) runs the UI **without** the Worker. There's no KV, so
  edits fall back to your browser's localStorage and the admin password is a
  local dev fallback (`Abdul0244058517`). Good for UI work.
- To test the **real** API locally (KV + auth), run:
  ```bash
  npm run build
  echo 'ADMIN_SECRET = "some-local-password"' > .dev.vars   # gitignored
  npx wrangler dev
  ```
  This simulates KV locally and serves the built site at the printed URL.

## Notes

- The whole editable site lives in one JSON document under the KV key
  `content`. `GET /api/content` is public; `PUT /api/content` requires the
  `ADMIN_SECRET` bearer token.
- **Use a long, random `ADMIN_SECRET`** (e.g. a password-manager-generated
  string), not a short human password. It's the only thing protecting writes,
  and there is no login rate-limiting.
- **One editor at a time.** Saving overwrites the whole content document
  (last-write-wins). If two people (or two browser tabs) edit at once, the last
  one to press Save wins and the other's changes are lost. Edit from a single
  tab, and press Save before leaving. (Inline text edits are now captured as you
  move between pages, so you can edit several pages in one session and Save once.)
- Tweet embeds load X's official `widgets.js`. If a post is deleted or X is
  unreachable, the embed degrades to a "View post on X" link automatically.
