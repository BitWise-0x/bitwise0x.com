'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
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

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <div>
      <LedgerLead kicker="Tag" title={title}>
        Every post filed under this topic
      </LedgerLead>

      <div className="ledger-search">
        <label>
          <span className="sr-only">Search articles</span>
          <input
            aria-label="Search articles"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Filter by title, summary, or tag"
          />
        </label>
      </div>

      <ul className="records records-topline">
        {!filteredBlogPosts.length && <li className="ledger-empty">No posts found.</li>}
        {displayPosts.map((post) => {
          const { path, date, title: postTitle, summary, tags } = post

          return (
            <li key={path} className="record no-side">
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
                  <span className="meta">
                    <time dateTime={date} suppressHydrationWarning>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
