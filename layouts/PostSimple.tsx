import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, readingTime } = content
  const basePath = path.split('/')[0]

  return (
    <article className="post">
      <ScrollTopAndComment />

      <header className="post-head">
        <p className="kicker">
          <span className="led-pulse" />
          <time dateTime={date} suppressHydrationWarning>
            {formatDate(date, siteMetadata.locale)}
          </time>
          {readingTime && <span>· {Math.ceil(readingTime.minutes)} min read</span>}
        </p>
        <h1>{title}</h1>
      </header>

      <div className="prose dark:prose-invert max-w-none">{children}</div>

      <footer className="post-foot">
        <div className="ledger-pager">
          {prev && prev.path ? (
            <Link href={`/${prev.path}`} aria-label={`Previous post: ${prev.title}`}>
              &larr; {prev.title}
            </Link>
          ) : (
            <Link href={`/${basePath}`} aria-label="Back to blog">
              &larr; Back to blog
            </Link>
          )}
          {next && next.path && (
            <Link href={`/${next.path}`} aria-label={`Next post: ${next.title}`}>
              {next.title} &rarr;
            </Link>
          )}
        </div>
      </footer>

      {siteMetadata.comments && (
        <div className="post-comments" id="comment">
          <Comments slug={slug} />
        </div>
      )}
    </article>
  )
}
