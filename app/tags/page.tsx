import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tags',
  description:
    'Browse all topics on BitWise — backend engineering, distributed systems, AI/ML, blockchain, and infrastructure.',
  path: 'tags',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="divide-theme flex flex-col items-start justify-start divide-y md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="page-title md:border-r-2 md:px-6">Tags</h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mr-5 mb-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="text-muted -ml-2 text-sm font-semibold uppercase"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
