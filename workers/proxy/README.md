# First-party analytics proxy

A Cloudflare Worker that serves the Umami Cloud tracker from the site's own
origin so content blockers do not strip it.

## Why

Umami Cloud serves its script from `cloud.umami.is` and receives beacons at
`cloud.umami.is/api/send`. Both are on the blocklists (EasyPrivacy and
similar) that uBlock Origin, Brave, and Pi-hole enforce, so a large share of a
developer audience never registers in the dashboard. The block is purely
hostname matching; it says nothing about Umami, which is cookieless and
privacy-first. Proxying the script and beacon through the apex under an opaque
path (`/i/*`) removes the third-party hostname the lists key on.

## Routes

| Request            | Upstream                    |
| ------------------ | --------------------------- |
| `GET  /i/e.js`     | `cloud.umami.is/script.js`  |
| `POST /i/send`     | `cloud.umami.is/api/send`   |

The tracker reads its beacon host from the `data-host-url` attribute, so the
site sets `umamiHostUrl` to `https://bitwise0x.com/i` and `src` to
`https://bitwise0x.com/i/e.js`. The Worker forwards `CF-Connecting-IP` as
`X-Forwarded-For` and the visitor `User-Agent`; without them every hit
collapses to Cloudflare's edge IP and an unknown client.

## Deploy

```sh
cd workers/proxy
npx wrangler login          # or set CLOUDFLARE_API_TOKEN
npx wrangler deploy
```

The zone `bitwise0x.com` must be active in the Cloudflare account (it is: the
site already proxies through Cloudflare). The route in `wrangler.toml` binds
`bitwise0x.com/i/*` to this Worker.

## Verify

```sh
# script proxied (bytes match upstream)
curl -s https://bitwise0x.com/i/e.js | head -c 200
curl -s https://cloud.umami.is/script.js | head -c 200

# beacon endpoint reachable (a bare POST returns the same shape as upstream)
curl -si -X POST https://bitwise0x.com/i/send \
  -H 'Content-Type: application/json' \
  -d '{"type":"event","payload":{"website":"23e367e0-635e-4f0e-a5ab-4b2b41c8acc0","url":"/"}}'
```

Then set the site env vars and ship a `deploy:` commit (only commits whose
message contains `deploy:` rebuild the site):

```sh
gh variable set NEXT_UMAMI_SRC --body 'https://bitwise0x.com/i/e.js'
gh variable set NEXT_UMAMI_HOST_URL --body 'https://bitwise0x.com/i'
```

After the deploy, confirm the rendered tag:

```sh
curl -s https://bitwise0x.com/ | grep -oE 'data-host-url[^,}]*'
```
