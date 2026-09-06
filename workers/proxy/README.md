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
| `GET  /i/e.js`      | `cloud.umami.is/script.js`  |
| `POST /i/api/send`  | `cloud.umami.is/api/send`   |

The tracker reads its beacon host from the `data-host-url` attribute and
appends `/api/send` to it, so with `umamiHostUrl` set to
`https://bitwise0x.com/i` the beacon lands on `/i/api/send`. The site also sets
`src` to `https://bitwise0x.com/i/e.js`.

The Worker forwards the visitor `User-Agent` and `x-umami-cache` headers and
writes `CF-Connecting-IP` into `payload.ip` of the beacon body. Forwarding the
IP as a header does not work: Umami Cloud is itself behind Cloudflare, whose
edge stamps `cf-connecting-ip` with the Worker's egress address, and Umami
ranks that header above `X-Forwarded-For`, so every visitor collapsed to one
location. Umami trusts `payload.ip` over any header and geolocates it from its
own database.

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
curl -si -X POST https://bitwise0x.com/i/api/send \
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
