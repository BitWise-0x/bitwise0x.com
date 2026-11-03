'use client'

import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Image from '@/components/Image'
import LedgerLead from '@/components/LedgerLead'
import siteMetadata from '@/data/siteMetadata'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  showTitle?: boolean
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+$/, '') // Remove any trailing /page
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav className="ledger-pager">
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
        >
          &larr; Previous
        </Link>
      ) : (
        <span className="disabled">&larr; Previous</span>
      )}
      <span className="count">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
          Next &rarr;
        </Link>
      ) : (
        <span className="disabled">Next &rarr;</span>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  showTitle,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div>
      <LedgerLead kicker="Writing" title={title} showTitle={showTitle}>
        Tales from the stack
      </LedgerLead>

      <ul className="records records-topline">
        {displayPosts.map((post) => {
          const { path, date, title: postTitle, summary, tags, heroImage, readingTime } = post
          const showThumbnail = heroImage && !heroImage.includes('social-banner')

          return (
            <li
              key={path}
              className={showThumbnail ? 'record no-side has-thumb' : 'record no-side'}
            >
              {showThumbnail && (
                <Link href={`/${path}`} aria-hidden="true" tabIndex={-1} className="record-thumb">
                  <Image src={heroImage} alt="" width={340} height={191} />
                </Link>
              )}

              <div className="record-head">
                <h3>
                  <Link href={`/${path}`}>{postTitle}</Link>
                </h3>
                {tags && tags.length > 0 && (
                  <p className="tag">
                    {tags.map((tag, i) => (
                      <Fragment key={tag}>
                        {i > 0 && ' · '}
                        <Link href={`/tags/${slug(tag)}`}>{tag}</Link>
                      </Fragment>
                    ))}
                  </p>
                )}
              </div>

              <div className="record-body">
                <p className="desc">{summary}</p>
                <div className="links">
                  <Link href={`/${path}`}>Read</Link>
                  <span className="meta">
                    <time dateTime={date} suppressHydrationWarning>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                    {readingTime && <span> · {Math.ceil(readingTime.minutes)} min</span>}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
