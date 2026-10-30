'use client'

import { usePathname } from 'next/navigation'
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
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div>
      <LedgerLead kicker="Writing" title={title}>
        Backends, distributed systems
      </LedgerLead>

      <div className="ledger-head">
        <span>Posts</span>
        <span>Date</span>
      </div>

      <ul className="records">
        {displayPosts.map((post, i) => {
          const { path, date, title: postTitle, summary, tags, heroImage, readingTime } = post
          const showThumbnail = heroImage && !heroImage.includes('social-banner')

          return (
            <li key={path} className={showThumbnail ? 'record has-thumb' : 'record'}>
              {showThumbnail && (
                <Link href={`/${path}`} aria-hidden="true" tabIndex={-1} className="record-thumb">
                  <Image src={heroImage} alt="" width={340} height={191} />
                </Link>
              )}

              <div className="record-head">
                <h3>
                  <Link href={`/${path}`}>{postTitle}</Link>
                </h3>
                {tags && tags.length > 0 && <p className="tag">{tags.join(' · ')}</p>}
              </div>

              <div className="record-body">
                <p className="desc">{summary}</p>
                <div className="links">
                  <Link href={`/${path}`}>Read</Link>
                </div>
              </div>

              <div className="side">
                <time dateTime={date} suppressHydrationWarning>
                  {formatDate(date, siteMetadata.locale)}
                </time>
                {readingTime && <span>{Math.ceil(readingTime.minutes)} min</span>}
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
