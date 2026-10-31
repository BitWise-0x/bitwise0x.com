import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import LedgerLead from '@/components/LedgerLead'

export const metadata = genPageMetadata({
  title: 'Tags',
  description:
    'Browse all topics on BitWise — backend engineering, distributed systems, AI/ML, blockchain, and infrastructure.',
  path: 'tags',
  image: '/static/og/tags.png',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div>
      <LedgerLead kicker="Index" title="Tags" aside={`${tagKeys.length} total`}>
        Topics by volume
      </LedgerLead>

      {tagKeys.length === 0 ? (
        <p className="ledger-empty">No tags found.</p>
      ) : (
        <div className="tag-cloud">
          {sortedTags.map((t) => (
            <Link
              key={t}
              href={`/tags/${slug(t)}`}
              className="pill"
              aria-label={`View posts tagged ${t}`}
            >
              {t.split(' ').join('-')}
              <span className="pill-count">{tagCounts[t]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
