'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

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
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="divide-theme divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="page-title">{title}</h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="bg-surface mt-12 hidden h-full max-h-screen max-w-[280px] min-w-[280px] flex-wrap overflow-auto rounded-sm shadow-md sm:flex dark:shadow-gray-800/40">
            <div className="px-6 pt-2 pb-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-primary-500 font-bold uppercase">All Posts</h3>
              ) : (
                <Link href={`/blog`} className="text-heading font-bold uppercase">
                  All Posts
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="text-muted hover:text-primary-500 px-3 py-2 text-sm font-medium uppercase"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="pt-12">
            <ul className="divide-theme divide-y">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, heroImage } = post
                const showThumbnail = heroImage && !heroImage.includes('social-banner')
                return (
                  <li key={path} className="py-5">
                    <article>
                      <div className="mb-3 sm:hidden">
                        <p className="text-muted text-base leading-6 font-medium">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </p>
                        <h2 className="mt-2 text-2xl leading-8 font-bold tracking-tight">
                          <Link href={`/${path}`} className="text-heading">
                            {title}
                          </Link>
                        </h2>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        {showThumbnail && (
                          <Link
                            href={`/${path}`}
                            className="shrink-0"
                            aria-hidden="true"
                            tabIndex={-1}
                          >
                            <Image
                              src={heroImage}
                              alt=""
                              width={280}
                              height={158}
                              className="w-full rounded-md object-cover sm:w-[280px]"
                            />
                          </Link>
                        )}
                        <div className="space-y-2">
                          <dl className="hidden sm:block">
                            <dt className="sr-only">Published on</dt>
                            <dd className="text-muted text-base leading-6 font-medium">
                              <time dateTime={date} suppressHydrationWarning>
                                {formatDate(date, siteMetadata.locale)}
                              </time>
                            </dd>
                          </dl>
                          <h2 className="hidden text-2xl leading-8 font-bold tracking-tight sm:block">
                            <Link href={`/${path}`} className="text-heading">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                          <div className="prose prose-summary max-w-none">{summary}</div>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
