import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Maps every file under public/static to the first 8 hex of its sha256. lib/asset.ts appends it
// to asset URLs, so a changed file gets a new URL and no cache (Cloudflare, link previews) keeps
// serving the old one. public/static/og is generated after the build and is not covered.
const publicDir = path.join(process.cwd(), 'public')
const outFile = path.join(process.cwd(), 'app', 'asset-manifest.json')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return entry.name === 'og' ? [] : walk(full)
      return entry.name.startsWith('.') ? [] : [full]
    })
  )
  return files.flat()
}

const files = (await walk(path.join(publicDir, 'static'))).sort()
const manifest = {}
for (const file of files) {
  const hash = createHash('sha256')
    .update(await readFile(file))
    .digest('hex')
  manifest['/' + path.relative(publicDir, file).split(path.sep).join('/')] = hash.slice(0, 8)
}
await writeFile(outFile, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Asset manifest: ${files.length} files`)
