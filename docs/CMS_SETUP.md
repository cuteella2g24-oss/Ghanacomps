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

That's it. Go to **`/admin`** on the site (e.g.
`https://ghanacomps.cuteella2g24.workers.dev/admin`), log in with the
`ADMIN_SECRET` password, edit the info in the forms, and press **Save Changes**.
Changes go live for everyone.

---

## How editing works now

All editing happens on one page: **`/admin`** (it's unlisted — reach it by
typing the URL). Log in with your `ADMIN_SECRET`, and you get a dashboard of
forms. Fill them in and press **Save Changes** once to publish everything.

The dashboard manages the site's *information* (the public pages themselves are
no longer click-to-edit — the old padlock is gone):

| Dashboard section | What it controls |
|-------------------|------------------|
| **Home — Latest News** | The homepage headline feed. |
| **Players — Transfers & Updates** | News items on the Current Players page. |
| **Players — Teams & Positions** | Each player's club/position. |
| **Players — Add Extra Players / Performers** | Extra squad entries and weekend performer cards. |
| **Legends & Cult — Comp / Archive Links** | Repoint any "Watch on X" link at a player's archive (blank = keep default). |
| **Legends — Essien Embedded Post** | Paste an X post URL to embed the clip (blank = show nothing). |
| **Legends / Cult — Add** | Add extra legend / cult-hero cards. |
| **Black Stars — Latest Update** | The editorial news block (eyebrow, title, body). |
| **Black Stars — Goals & Moments** | X post URLs that embed and play on the site. |
| **Black Stars — Fixtures & Countdowns** | Matchup, detail, and the ISO kickoff that drives the live countdown. |
| **Home / Black Stars — Highlights** | Self-hosted clip tiles (or embed an X post). |
| **GPA — Weekly Links** | The GPA Weekly link buttons. |

Anything left blank falls back to the built-in default. Page wording/design is
fixed and not edited here (by design).

---

## Local development

- `npm run dev` (Vite) runs the UI **without** the Worker. There's no KV, so
  `/admin` lets you in with any password and edits save to your browser's
  localStorage. Good for UI work.
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
