// First-party reverse proxy for the Umami Cloud tracker.
//
// Content blockers match the third-party hostname (cloud.umami.is), not the
// script's intent, so the cloud endpoint is blocked for a large share of a
// developer audience. Serving the script and its beacon endpoint from the
// site's own origin under an opaque path (/i/*) sidesteps that list matching
// and recovers the lost traffic. See workers/proxy/README.md.

const UPSTREAM = 'https://cloud.umami.is'
const SCRIPT_UPSTREAM = `${UPSTREAM}/script.js`
const SEND_UPSTREAM = `${UPSTREAM}/api/send`

// how long the edge caches the tracker script, in seconds
const SCRIPT_CACHE_SECONDS = 86400

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/i/e.js' && request.method === 'GET') {
      return proxyScript()
    }

    // The tracker builds its beacon URL as data-host-url + /api/send, so with
    // data-host-url = https://bitwise0x.com/i the path is /i/api/send.
    if (url.pathname === '/i/api/send' && request.method === 'POST') {
      return proxySend(request)
    }

    return new Response('Not found', { status: 404 })
  },
}

async function proxyScript() {
  const upstream = await fetch(SCRIPT_UPSTREAM, {
    cf: { cacheTtl: SCRIPT_CACHE_SECONDS, cacheEverything: true },
  })

  if (!upstream.ok) {
    return new Response('Upstream error', { status: 502 })
  }

  const headers = new Headers()
  headers.set('Content-Type', 'application/javascript; charset=utf-8')
  headers.set('Cache-Control', `public, max-age=${SCRIPT_CACHE_SECONDS}`)

  return new Response(upstream.body, { status: 200, headers })
}

async function proxySend(request) {
  const body = await withClientIp(request)

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  // Umami parses the visitor's UA server-side; without it every hit is "unknown".
  const userAgent = request.headers.get('User-Agent')
  if (userAgent) headers.set('User-Agent', userAgent)
  // Session cache token issued by the previous beacon; without it umami
  // re-resolves the session on every hit.
  const cache = request.headers.get('x-umami-cache')
  if (cache) headers.set('x-umami-cache', cache)

  const upstream = await fetch(SEND_UPSTREAM, {
    method: 'POST',
    headers,
    body,
  })

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'text/plain' },
  })
}

// Umami Cloud sits behind Cloudflare too, so its edge stamps cf-connecting-ip
// (which it prefers over X-Forwarded-For) with this Worker's egress address and
// every visitor collapses to one location. Umami trusts payload.ip over any
// header and geolocates it from its own database, so put the visitor's IP there.
async function withClientIp(request) {
  const raw = await request.text()
  const clientIp = request.headers.get('CF-Connecting-IP')
  if (!clientIp) return raw

  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return raw
  }
  if (!body || typeof body.payload !== 'object' || body.payload === null) return raw

  body.payload.ip = clientIp
  return JSON.stringify(body)
}
