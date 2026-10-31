import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import ShareLinks from '@/components/ShareLinks'
import RelatedPosts from '@/components/RelatedPosts'
import PostTitle from '@/components/PostTitle'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  relatedPosts?: CoreContent<Blog>[]
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  relatedPosts,
  children,
}: LayoutProps) {
  const { path, slug, date, title, tags, readingTime } = content
  const basePath = path.split('/')[0]
  const authorNames = authorDetails.map((a) => a.name).join(', ')

  return (
    <article className="post">
      <ScrollTopAndComment />

      <header className="post-head">
        <p className="kicker">
          <span className="led-pulse" />
          <time dateTime={date} suppressHydrationWarning>
            {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
          </time>
          {readingTime && <span>· {Math.ceil(readingTime.minutes)} min read</span>}
          {authorNames && <span>· {authorNames}</span>}
        </p>
        <PostTitle title={title} />
      </header>

      <div className="prose dark:prose-invert max-w-none">{children}</div>

      <ShareLinks path={path} title={title} />

      {relatedPosts && <RelatedPosts currentSlug={slug} currentTags={tags} posts={relatedPosts} />}

      <footer className="post-foot">
        {tags && tags.length > 0 && (
          <div className="post-tags">
            <h2 className="ledger-head">Tags</h2>
            <div className="flex flex-wrap">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        )}

        {(next || prev) && (
          <div className="post-nav">
            {prev && prev.path && (
              <div>
                <h2 className="ledger-head">Previous</h2>
                <Link href={`/${prev.path}`}>{prev.title}</Link>
              </div>
            )}
            {next && next.path && (
              <div>
                <h2 className="ledger-head">Next</h2>
                <Link href={`/${next.path}`}>{next.title}</Link>
              </div>
            )}
          </div>
        )}

        <div className="ledger-pager">
          <Link href={`/${basePath}`} aria-label="Back to blog">
            &larr; Back to blog
          </Link>
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
