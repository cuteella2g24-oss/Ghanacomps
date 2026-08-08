/**
 * GhanaComps Worker — serves the built SPA (static assets) AND a tiny content API
 * backed by Cloudflare KV, so admin edits persist server-side and every visitor
 * sees them (not just the admin's own browser).
 *
 * Routes (see `run_worker_first = ["/api/*"]` in wrangler.toml):
 *   GET  /api/content  → public. Returns the single content JSON blob (or {}).
 *   PUT  /api/content  → token-gated. Body = full content JSON. Overwrites the blob.
 *   *                  → falls through to static assets (with SPA not_found_handling).
 *
 * Bindings (wrangler.toml):
 *   CONTENT       KV namespace holding one key, "content".
 *   ASSETS        Static-assets binding (the built ./dist).
 *   ADMIN_SECRET  Secret (`wrangler secret put ADMIN_SECRET`) = the admin password.
 */

const CONTENT_KEY = 'content';
const MAX_BODY_BYTES = 1_000_000; // 1MB guardrail on the content blob

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...extra },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Login check — lets the admin panel confirm the password immediately
    // without writing anything.
    if (url.pathname === '/api/auth' && request.method === 'GET') {
      const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
      if (env.ADMIN_SECRET && token === env.ADMIN_SECRET) return json({ ok: true });
      return json({ error: 'unauthorized' }, 401);
    }

    if (url.pathname === '/api/content') {
      if (request.method === 'GET') {
        const stored = await env.CONTENT.get(CONTENT_KEY);
        return json(stored ? JSON.parse(stored) : {}, 200, {
          'cache-control': 'no-store',
        });
      }

      if (request.method === 'PUT') {
        const auth = request.headers.get('authorization') || '';
        const token = auth.replace(/^Bearer\s+/i, '');
        if (!env.ADMIN_SECRET || token !== env.ADMIN_SECRET) {
          return json({ error: 'unauthorized' }, 401);
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return json({ error: 'payload too large' }, 413);
        }
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return json({ error: 'invalid json' }, 400);
        }
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return json({ error: 'content must be an object' }, 400);
        }

        await env.CONTENT.put(CONTENT_KEY, JSON.stringify(parsed));
        return json({ ok: true });
      }

      return json({ error: 'method not allowed' }, 405, { allow: 'GET, PUT' });
    }

    // Everything else → static assets (built SPA + not_found_handling fallback).
    return env.ASSETS.fetch(request);
  },
};
