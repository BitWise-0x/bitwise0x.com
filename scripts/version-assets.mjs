import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// Last postbuild step: adds ?v=<content hash> to every /static/ URL in the exported HTML and XML
// that does not carry one yet. That covers what lib/asset.ts cannot see at render time: the
// Open Graph cards scripts/og.mjs writes after the build, the RSS feed and public/connect.
const outDir = 'out'
const assetUrl = /(\/static\/[\w./-]+\.(?:png|jpe?g|webp|gif|svg|mp4|webmanifest))(?![\w./-]*\?v=)/g

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

const hashes = new Map()
function hashOf(url) {
  if (!hashes.has(url)) {
    const file = path.join(outDir, url)
    const hash = existsSync(file)
      ? createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8)
      : null
    hashes.set(url, hash)
  }
  return hashes.get(url)
}

const versionAssets = () => {
  if (!existsSync(outDir)) return
  let changed = 0
  for (const file of walk(outDir).filter((f) => /\.(html|xml|webmanifest)$/.test(f))) {
    const text = readFileSync(file, 'utf8')
    const next = text.replace(assetUrl, (url) => {
      const hash = hashOf(url)
      return hash ? `${url}?v=${hash}` : url
    })
    if (next !== text) {
      writeFileSync(file, next)
      changed++
    }
  }
  console.log(`Asset URLs versioned in ${changed} files`)
}

export default versionAssets
