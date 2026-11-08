import manifest from 'app/asset-manifest.json'

const hashes: Record<string, string> = manifest

// Adds the file's content hash (scripts/asset-manifest.mjs) as ?v=, so a changed asset gets a new URL.
export const versioned = (src: string): string => {
  const hash = hashes[src]
  return hash ? `${src}?v=${hash}` : src
}
