# Domain Flip: Promote `blog.bitwise0x.com` to Canonical

**Date:** 2026-04-27
**Status:** Approved direction; pending implementation plan
**Owner:** Rob (BitWise-0x)

## Summary

Promote `blog.bitwise0x.com` to be the canonical, indexed home of the BitWise blog. Demote `blog.bitwisesolutions.co` to a permanent 301 redirector. Park the apex `bitwise0x.com` (and `www.bitwise0x.com`) as a 301 to `blog.bitwise0x.com` for now, with the explicit intent that the apex will later become a hand-built home/landing page that links _to_ the blog subdomain.

The existing `bitwise0x-proxy` Cloudflare Worker (a transparent reverse proxy) is replaced in place with a single multi-route redirect Worker that handles every non-canonical hostname.

## Goals

1. **Branding:** `bitwise0x.com` becomes the public-facing identity.
2. **Decouple from `bitwisesolutions.co`:** No future content lives there; it only redirects.
3. **SEO consolidation:** All link equity consolidates onto `blog.bitwise0x.com` via Google-blessed 301 + Search Console Change of Address.
4. **Future-proof:** When the apex is built out as a landing page later, the blog's canonical does not change again.

## Non-Goals

- Building the apex landing page. That is a separate project; for now apex 301s.
- Migrating off GitHub Pages. The hosting stack stays as-is.
- Changing the email domain. `rob@bitwisesolutions.co` continues to work; it has no SEO impact.
- Retiring the `bitwisesolutions.co` zone. It stays registered and active, with `blog.` 301-redirecting indefinitely.

## Current State (verified 2026-04-27)

- `blog.bitwisesolutions.co` is the GitHub Pages origin (CNAME file in repo). Cloudflare DNS proxies it.
- `bitwise0x.com` and `www.bitwise0x.com` are served by the Cloudflare Worker `bitwise0x-proxy` at `/Users/evilkernel/_GIT/___local/orchestration/Orchestration-BitWise/Traefik/cloudflare-worker/`. The Worker fetches `https://blog.bitwisesolutions.co<path>` and returns the response, spoofing Host/Referer/Origin headers and stripping `x-frame-options`.
- Both hostnames currently serve identical HTML, with `<link rel="canonical" href="https://blog.bitwisesolutions.co">`, `og:url` matching, `robots.txt` and `sitemap.xml` referencing the blog domain.
- `data/siteMetadata.js` has `siteUrl: 'https://blog.bitwisesolutions.co'`.
- Three blog posts have hardcoded `canonicalUrl` frontmatter pointing at `blog.bitwisesolutions.co`:
  - `data/blog/generating-structured-output-from-llms.mdx`
  - `data/blog/understanding-automated-market-maker.mdx`
  - `data/blog/executing-comfyui-workflows-as-standalone-scripts.mdx`
- GitHub Pages deploy workflow at `.github/workflows/pages.yml`. Pages workflow only builds commits prefixed with `deploy:`.

## Target State

```
                                  GitHub Pages
                                       ▲
                                       │ (CNAME: blog.bitwise0x.com)
                                       │
                              ┌────────┴────────┐
                              │ blog.bitwise0x  │   ◄── canonical, indexed
                              │      .com       │
                              └─────────────────┘
                                       ▲
                                       │ 301
                              ┌────────┴────────┐
                              │   bitwise0x.com │
                              │ www.bitwise0x.com│
                              │ blog.bitwise-   │
                              │  solutions.co   │
                              └─────────────────┘
                                       │
                                       │ handled by
                                       ▼
                          ┌────────────────────────┐
                          │ Cloudflare Worker      │
                          │ (bitwise-redirects)    │
                          │ 301 → blog.bitwise0x   │
                          │       .com<path><qs>   │
                          └────────────────────────┘
```

- **`blog.bitwise0x.com`** — the only "real" origin. GitHub Pages serves directly. Self-referential canonical.
- **`bitwise0x.com`, `www.bitwise0x.com`, `blog.bitwisesolutions.co`** — all 301 to `https://blog.bitwise0x.com<path><querystring>` via a single Cloudflare Worker.
- **`bitwisesolutions.co` apex and `www.bitwisesolutions.co`** — out of scope; left untouched (may host other content unrelated to the blog).

## Architecture Decisions

### Decision 1: Single multi-route Worker

The existing `bitwise0x-proxy` Worker is reused in place — same project, same name, new logic. It handles all three legacy hostnames (`bitwise0x.com`, `www.bitwise0x.com`, `blog.bitwisesolutions.co`) via route patterns. Logic is ~15 lines: build the new URL, return a 301 with `Location`, `Cache-Control: public, max-age=3600`, and `Vary: Host`.

**Why:** One Worker, one `wrangler.toml`, one source-of-truth in git. Cleaner than Cloudflare Bulk Redirects (which would split config across the dashboard) and trivially reviewable.

### Decision 2: 301 (permanent) not 302

301 is the SEO-correct signal for permanent moves. Google fully transfers link equity. 302 would signal "temporary" and slow consolidation.

### Decision 3: Path + querystring preserved verbatim

Every 301 maps `oldhost/<path>?<qs>` to `https://blog.bitwise0x.com/<path>?<qs>` 1-for-1. No path rewriting. This is what Google's Change of Address tool expects and what every existing inbound link needs.

### Decision 4: Subdomain (`blog.`) not apex for the canonical

Reserves the apex (`bitwise0x.com`) for a future hand-built landing page. Avoids ever needing a _second_ canonical migration when the landing page ships.

### Decision 5: GitHub Pages stays the origin

No hosting change. Just swap the `CNAME` file from `blog.bitwisesolutions.co` to `blog.bitwise0x.com` and update GitHub Pages settings to match. Keeps the deploy pipeline (the `deploy:` commit-prefix workflow) intact.

## Components & Changes

### A. Cloudflare Worker (`Orchestration-BitWise/Traefik/cloudflare-worker/`)

**`worker.js`** — full rewrite. New behavior: 301 redirect, path + query preserved, no fetching of origin.

**`wrangler.toml`** — update routes:

- Remove: nothing (all existing routes stay).
- Add: `blog.bitwisesolutions.co/*` (zone `bitwisesolutions.co`).
- Optional: `www.bitwisesolutions.co/*` if Rob wants the `www.` version covered too. Out of scope unless explicitly requested.
- Worker name stays as `bitwise0x-proxy`. Renaming would create a new Worker (the old one would need manual deletion) and risks a routing gap during cutover. The name is internal-only and has no user-visible effect.

### B. Repo (`blog-bitwise/`)

**`CNAME`** — change content from `blog.bitwisesolutions.co` to `blog.bitwise0x.com`.

**`data/siteMetadata.js`** — change `siteUrl` from `'https://blog.bitwisesolutions.co'` to `'https://blog.bitwise0x.com'`. This propagates into `<link rel="canonical">`, `og:url`, `twitter:url`, sitemap entries, and the RSS feed.

**Three blog post frontmatter files** — change hardcoded `canonicalUrl`:

- `data/blog/generating-structured-output-from-llms.mdx`
- `data/blog/understanding-automated-market-maker.mdx`
- `data/blog/executing-comfyui-workflows-as-standalone-scripts.mdx`

**Sweep for stragglers** — grep `data/`, `app/`, `components/`, `layouts/`, `scripts/`, `public/` for `bitwisesolutions.co` and verify nothing else needs changing. Email references (`rob@bitwisesolutions.co`) are intentionally left as-is.

**Commit prefix** — all commits to `main` that should trigger a Pages deploy MUST start with `deploy:` (per `.github/workflows/pages.yml` filter and `MEMORY.md`).

### C. Cloudflare DNS (manual, in dashboard)

**Zone `bitwise0x.com`:**

- Add CNAME `blog` → `bitwise-0x.github.io`. Proxy status: orange-cloud (proxied). TTL: auto.
- Apex `bitwise0x.com` and `www`: leave as-is. The Worker route intercepts before they hit any origin, so their A/AAAA/CNAME records do not need to point anywhere meaningful — but they need to exist (any record) so Cloudflare's edge accepts the request and the Worker route fires. If they currently point at a placeholder, that stays.

**Zone `bitwisesolutions.co`:**

- `blog` CNAME stays as-is (still points at GitHub Pages). The new Worker route intercepts requests for `blog.bitwisesolutions.co/*` _before_ they reach origin, so the DNS record's actual target is irrelevant once the route is active. Leaving it pointed at GitHub Pages is harmless and provides a fallback if the Worker is ever disabled.

### D. GitHub Pages settings (manual, in GitHub repo UI)

- Repo: `BitWise-0x/blog-bitwise` → Settings → Pages.
- Custom domain: change to `blog.bitwise0x.com`. GitHub will run a DNS check; this requires the new CNAME from step C to already exist.
- Enable "Enforce HTTPS." May take a few minutes for the cert to provision.

### E. Google Search Console (manual)

1. Add new property: `https://blog.bitwise0x.com` (URL prefix property). Verify via DNS TXT record (preferred) or whichever verification method the existing property uses.
2. From the existing `blog.bitwisesolutions.co` property → Settings → **Change of Address** → select the new property. Google validates that 301s are in place before accepting.
3. Submit the new sitemap (`https://blog.bitwise0x.com/sitemap.xml`) on the new property.
4. Keep the old property active indefinitely so Search Console can monitor the move.

## Data Flow

A user clicks a link to `https://blog.bitwisesolutions.co/blog/some-post?ref=xyz`:

1. DNS resolves to Cloudflare edge.
2. Cloudflare matches Worker route `blog.bitwisesolutions.co/*` → fires `bitwise0x-proxy` Worker.
3. Worker constructs `https://blog.bitwise0x.com/blog/some-post?ref=xyz`.
4. Worker returns 301 with `Location` header to that URL.
5. Browser follows to `https://blog.bitwise0x.com/blog/some-post?ref=xyz`.
6. Cloudflare edge for `blog.bitwise0x.com` (proxied DNS, no Worker route) → fetches from GitHub Pages origin.
7. GitHub Pages serves the static page. HTML now has `<link rel="canonical" href="https://blog.bitwise0x.com/blog/some-post">`.

A search bot crawling `bitwise0x.com/blog/some-post` follows the same 301 path and indexes only the canonical URL.

## Worker Implementation Sketch

```js
const CANONICAL_ORIGIN = 'https://blog.bitwise0x.com'

const worker = {
  async fetch(request) {
    const url = new URL(request.url)
    const target = `${CANONICAL_ORIGIN}${url.pathname}${url.search}`
    return new Response(null, {
      status: 301,
      headers: {
        Location: target,
        'Cache-Control': 'public, max-age=3600',
        Vary: 'Host',
      },
    })
  },
}

export default worker
```

`wrangler.toml` routes:

```toml
routes = [
  { pattern = "bitwise0x.com/*", zone_name = "bitwise0x.com" },
  { pattern = "www.bitwise0x.com/*", zone_name = "bitwise0x.com" },
  { pattern = "blog.bitwisesolutions.co/*", zone_name = "bitwisesolutions.co" },
]
```

## Cutover Sequence (order matters)

1. **DNS first:** Add `blog.bitwise0x.com` CNAME → `bitwise-0x.github.io` in Cloudflare. Wait for propagation (typically <1 min on Cloudflare).
2. **GitHub Pages settings:** Set custom domain to `blog.bitwise0x.com`, enable HTTPS. Wait for cert.
3. **Verify new origin works:** `curl -I https://blog.bitwise0x.com/` returns 200 with GitHub Pages headers.
4. **Repo update + deploy:** Update `CNAME`, `siteUrl`, three `canonicalUrl` frontmatter fields. Commit with `deploy:` prefix. Push. Wait for Pages workflow to complete.
5. **Verify canonical flipped:** `curl -s https://blog.bitwise0x.com/ | grep canonical` shows the new domain.
6. **Worker deploy:** Update `worker.js` and `wrangler.toml`, run `wrangler deploy`. The new route `blog.bitwisesolutions.co/*` activates; the `bitwise0x.com` and `www.bitwise0x.com` routes flip from proxy to redirect.
7. **Verify all 301s:** `curl -I https://bitwise0x.com/`, `https://www.bitwise0x.com/`, `https://blog.bitwisesolutions.co/blog/some-post` all return 301 with correct `Location`.
8. **Search Console:** Add new property, verify, file Change of Address, resubmit sitemap.

If any step fails, the previous step is the rollback point — earlier steps don't depend on later ones.

## Verification Checklist

After cutover, all of these must hold:

- [ ] `curl -sI https://blog.bitwise0x.com/` → 200, served by GitHub Pages.
- [ ] `curl -sI https://blog.bitwise0x.com/blog/` → 200.
- [ ] `curl -s https://blog.bitwise0x.com/ | grep canonical` → `href="https://blog.bitwise0x.com"`.
- [ ] `curl -s https://blog.bitwise0x.com/sitemap.xml | head` → `<loc>https://blog.bitwise0x.com/...`.
- [ ] `curl -s https://blog.bitwise0x.com/robots.txt` → `Sitemap: https://blog.bitwise0x.com/sitemap.xml`.
- [ ] `curl -sI https://bitwise0x.com/` → 301, `Location: https://blog.bitwise0x.com/`.
- [ ] `curl -sI https://www.bitwise0x.com/blog/foo?bar=1` → 301, `Location: https://blog.bitwise0x.com/blog/foo?bar=1`.
- [ ] `curl -sI https://blog.bitwisesolutions.co/blog/some-post` → 301, `Location: https://blog.bitwise0x.com/blog/some-post`.
- [ ] Three previously-hardcoded posts: `curl -s <new-url> | grep canonical` matches new domain.
- [ ] Google Search Console Change of Address validates and is accepted.

## Risks & Mitigations

| Risk                                         | Likelihood | Impact             | Mitigation                                                                                                                                                                             |
| -------------------------------------------- | ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Pages cert provisioning hangs         | Low        | Medium             | Wait up to ~15 min; if stuck, toggle custom domain off/on in Pages settings.                                                                                                           |
| Old Worker proxy still active when DNS swaps | Low        | Low (404s briefly) | Cutover order above ensures new origin is verified before Worker rewrite.                                                                                                              |
| Search Console rejects Change of Address     | Medium     | Low                | Usually means 301s aren't yet visible to Google. Wait 24–48h, retry. The Change of Address validates by crawling — verify with `curl` first.                                           |
| Caching: old canonical in CDN/edge           | Medium     | Low                | Cloudflare cache purges automatically on Worker deploy for the affected hostnames. Pages cache (Fastly) flushes within 600s per the `cache-control: max-age=600` already on responses. |
| `www.bitwisesolutions.co` not redirected     | Low        | Low                | Out of scope; can be added later if any inbound traffic shows up.                                                                                                                      |
| Rob reverts mid-flight                       | N/A        | N/A                | Every step is reversible. Worst case: revert worker, revert `CNAME`, revert `siteMetadata.js`, redeploy.                                                                               |

## SEO Expectations

- **Week 1–2:** Google starts crawling 301s, begins indexing new URLs. Some old URLs still appear in SERPs.
- **Week 2–4:** New URLs replace old ones in SERPs for most queries. Search Console "Change of Address" complete.
- **Month 2–3:** Full link-equity consolidation. Old domain becomes a near-empty property in Search Console (only redirect crawls).
- **Long term:** Old hostnames remain 301-redirecting indefinitely (free on Cloudflare Workers).

Expected traffic dip during transition: typically <10%, recovers within ~6 weeks. Footprint here is small (3 indexed posts, recent domain) so the absolute impact is minimal.

## Out of Scope

- Building the apex landing page at `bitwise0x.com`. Tracked separately; until then apex 301s.
- Touching the `bitwisesolutions.co` apex or any non-`blog.` subdomain.
- Migrating analytics (Umami) — analytics will continue to work; only the recorded hostname changes.
- Migrating Giscus comments — comments are keyed by GitHub discussion, not by hostname, so no migration needed.
- Email infrastructure (`rob@bitwisesolutions.co`).

## Open Questions

None at design time. All flagged ambiguities (apex behavior, canonical subdomain vs. apex, redirect vs. mirror, future apex plans) resolved in conversation prior to writing this spec.
