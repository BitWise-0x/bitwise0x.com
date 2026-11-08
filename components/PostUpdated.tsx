import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

// The post header's "Updated" date. Shown only when lastmod falls on a later day than the publish
// date, so a post keeps its original date and an edit is still visible.
export default function PostUpdated({ date, lastmod }: { date: string; lastmod?: string }) {
  if (!lastmod || lastmod.slice(0, 10) <= date.slice(0, 10)) return null
  return (
    <span className="post-updated">
      · Updated{' '}
      <time dateTime={lastmod} suppressHydrationWarning>
        {formatDate(lastmod, siteMetadata.locale)}
      </time>
    </span>
  )
}
